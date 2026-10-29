import { expect, test } from '@playwright/test'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const registry = JSON.parse(
  readFileSync(new URL('../src/layout-intents/screens.json', import.meta.url), 'utf8'),
)

type Action = {
  type: 'fill' | 'click' | 'repeatText' | 'selectOption' | 'focus' | 'press'
  selector: string
  value?: string
  times?: number
}
type Scenario = {
  id: string
  state: string
  actions?: Action[]
  minGroups?: number
  primaryActions?: number
  expectInvalid?: boolean
  expectVisible?: string
  expectFocused?: string
  expectCount?: { selector: string; count: number }
  expectText?: { selector: string; value: string }
}
type Screen = {
  id: string
  path: string
  kind: 'form' | 'search' | 'dashboard' | 'login' | 'content'
  purpose: string
  scenarios: Scenario[]
}
const screens = registry.screens as unknown as Screen[]
const runId = process.env.LAYOUT_RUN_ID || 'manual'

for (const screen of screens) {
  for (const scenario of screen.scenarios) {
    test(`${screen.id}/${scenario.id} — layout contextual, comportamento e captura`, async ({
      page,
    }, info) => {
      await page.goto(screen.path)
      await page.locator('[data-layout-root]').waitFor({ state: 'visible' })
      // SSR markup is visible before React hydration. Interactions must wait for event handlers.
      await page.waitForFunction(
        () => document.documentElement.dataset.appHydrated === 'true',
        null,
        { timeout: 20_000 },
      )
      await page.evaluate(() => document.fonts.ready)
      for (const action of scenario.actions || []) {
        if (action.type === 'fill') await page.locator(action.selector).fill(action.value || '')
        if (action.type === 'click') await page.locator(action.selector).click()
        if (action.type === 'selectOption')
          await page.locator(action.selector).selectOption(action.value || '')
        if (action.type === 'focus') await page.locator(action.selector).focus()
        if (action.type === 'press')
          await page.locator(action.selector).press(action.value || 'Tab')
        if (action.type === 'repeatText') {
          await page.locator(action.selector).evaluate((node, times) => {
            node.textContent = ((node.textContent || '') + ' ').repeat(times).trim()
          }, action.times || 3)
        }
      }
      if (scenario.expectVisible) await expect(page.locator(scenario.expectVisible)).toBeVisible()
      if (scenario.expectFocused) await expect(page.locator(scenario.expectFocused)).toBeFocused()
      if (scenario.expectCount)
        await expect(page.locator(scenario.expectCount.selector)).toHaveCount(
          scenario.expectCount.count,
        )
      if (scenario.expectText)
        await expect(page.locator(scenario.expectText.selector)).toContainText(
          scenario.expectText.value,
        )
      if (scenario.expectInvalid) {
        expect(
          await page.locator('form :invalid').count(),
          'O cenário de erro deve realmente ter campos inválidos',
        ).toBeGreaterThan(0)
      }

      const metrics = await page.evaluate(
        ({ kind, minGroups, expectedPrimary }) => {
          type Issue = {
            dimension: string
            severity: 'minor' | 'major' | 'critical'
            message: string
          }
          const issues: Issue[] = []
          const add = (dimension: string, severity: Issue['severity'], message: string) =>
            issues.push({ dimension, severity, message })
          const visible = (node: Element) => {
            const box = node.getBoundingClientRect()
            const css = getComputedStyle(node)
            return (
              box.width > 0 &&
              box.height > 0 &&
              css.display !== 'none' &&
              css.visibility !== 'hidden'
            )
          }
          const all = (sel: string) =>
            [...document.querySelectorAll(sel)].filter(visible) as HTMLElement[]
          const width = window.innerWidth
          const overflow = Math.max(0, document.documentElement.scrollWidth - width)
          const root = all('[data-layout-root]')[0]
          const headings = all('[data-layout-heading]')
          const heading = headings[0] || all('main h1, main h2, main h3')[0]
          const actions = all('[data-layout-primary-action]')
          const groups = all('[data-layout-group]')
          const controls = all(
            'main input:not([type="hidden"]), main select, main textarea, main button',
          )
          const primaryMismatch = expectedPrimary !== null && actions.length !== expectedPrimary
          if (!heading) add('hierarchy', 'major', 'Não há título visível da tarefa')
          if (primaryMismatch)
            add(
              'hierarchy',
              'major',
              `Ações principais: ${actions.length}; esperado ${expectedPrimary}`,
            )
          if (groups.length < minGroups)
            add(
              'grouping',
              'major',
              `Grupos visíveis: ${groups.length}; mínimo esperado ${minGroups}`,
            )
          const tiny = controls.filter((el) => el.getBoundingClientRect().height < 32)
          if (tiny.length)
            add('density', 'major', `${tiny.length} controles abaixo de 32px de altura`)
          // Texto é analisado por clipping mensurável, não por uma largura de formulário fixa.
          const clippedControls = controls.filter((el) => {
            const box = el.getBoundingClientRect()
            return box.left < -2 || box.right > width + 2
          })
          if (overflow > 2)
            add('responsive', 'critical', `Overflow horizontal: ${Math.round(overflow)}px`)
          if (clippedControls.length)
            add('responsive', 'critical', `${clippedControls.length} controles fora do viewport`)
          if (!root) add('responsive', 'critical', 'Elemento data-layout-root não localizado')
          const unlabeled = all(
            'main input:not([type="hidden"]), main select, main textarea',
          ).filter(
            (el) =>
              !(el as HTMLInputElement).labels?.length &&
              !el.getAttribute('aria-label') &&
              !el.getAttribute('aria-labelledby'),
          )
          if (unlabeled.length)
            add('accessibility', 'major', `${unlabeled.length} campos sem rótulo associado`)
          // As dimensões não são um julgamento estético. Pesos variam pela natureza da tela.
          const weights =
            kind === 'dashboard'
              ? { hierarchy: 0.3, grouping: 0.2, density: 0.25, responsive: 0.25 }
              : kind === 'search'
                ? { hierarchy: 0.2, grouping: 0.3, density: 0.2, responsive: 0.3 }
                : { hierarchy: 0.25, grouping: 0.25, density: 0.2, responsive: 0.3 }
          const dimensions = {
            hierarchy: 100 - (heading ? 0 : 50) - (primaryMismatch ? 35 : 0),
            grouping: groups.length < minGroups ? 55 : 100,
            density: tiny.length ? 60 : 100,
            responsive: overflow > 2 || clippedControls.length || !root ? 20 : 100,
          }
          const score = Math.round(
            Object.entries(weights).reduce(
              (sum, [key, weight]) => sum + dimensions[key as keyof typeof dimensions] * weight,
              0,
            ),
          )
          return {
            viewport: width,
            overflow,
            controls: controls.length,
            groups: groups.length,
            heading: heading?.textContent?.trim().slice(0, 80) || null,
            score,
            dimensions,
            weights,
            issues,
          }
        },
        {
          kind: screen.kind,
          minGroups: scenario.minGroups ?? 0,
          expectedPrimary: scenario.primaryActions ?? null,
        },
      )

      mkdirSync('artifacts/metrics', { recursive: true })
      mkdirSync('artifacts/screenshots', { recursive: true })
      const slug = `${screen.id}-${scenario.id}-${info.project.name}`
      await page.screenshot({ path: join('artifacts/screenshots', `${slug}.png`), fullPage: true })
      writeFileSync(
        join('artifacts/metrics', `${slug}.json`),
        JSON.stringify(
          {
            runId,
            id: screen.id,
            path: screen.path,
            kind: screen.kind,
            purpose: screen.purpose,
            scenario: scenario.id,
            state: scenario.state,
            profile: info.project.name,
            ...metrics,
          },
          null,
          2,
        ),
      )
      expect(
        metrics.issues.filter((it) => it.severity === 'critical'),
        'Sem problemas críticos de responsividade',
      ).toEqual([])
      expect(
        metrics.issues.filter((it) => it.dimension === 'accessibility' && it.severity === 'major'),
        'Campos rotulados',
      ).toEqual([])
    })
  }
}
