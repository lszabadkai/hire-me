import { test, expect } from '@playwright/test'

test.describe('Start Screen', () => {
  test('renders title and start button', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Hire Me!' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Játék indítása|Start Game/ })).toBeVisible()
  })

  test('language toggle switches UI text', async ({ page }) => {
    await page.goto('/')
    const langToggle = page.getByRole('button', { name: /^EN$|^HU$/ })
    await expect(langToggle).toBeVisible()

    const before = await page.getByRole('button', { name: /Játék indítása|Start Game/ }).textContent()
    await langToggle.click()
    const after = await page.getByRole('button', { name: /Játék indítása|Start Game/ }).textContent()

    expect(after).not.toBe(before)
  })
})

test.describe('Core Loop', () => {
  test('starting game shows HUD and decisions', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Játék indítása|Start Game/ }).click()

    await expect(page.getByText(/1\/5/)).toBeVisible()
    await expect(page.getByRole('button', { name: /FELVESZ|HIRE/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /ELUTASÍT|REJECT/ })).toBeVisible()
  })

  test('a decision updates the score from 0', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Játék indítása|Start Game/ }).click()

    const score = page.locator('text=/Pontszám:|Score:/').first()
    await expect(score).toContainText(/0/)

    await page.getByRole('button', { name: /FELVESZ|HIRE/ }).click()
    await expect(page.getByRole('button', { name: /FELVESZ|HIRE/ })).toBeDisabled()

    await page.waitForTimeout(1000)
    await expect(score).not.toContainText(/0$/)
  })

  test('after 4 decisions, level end appears and can continue', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Játék indítása|Start Game/ }).click()

    for (let i = 0; i < 4; i++) {
      const btn = page.getByRole('button', { name: /FELVESZ|HIRE/ })
      await expect(btn).toBeEnabled({ timeout: 5000 })
      await btn.click()
      await page.waitForTimeout(1000)
    }

    await expect(page.getByRole('heading', { name: /Szint vége!|Level Complete!/ })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Következő szint|Next Level/ }).click()
    await expect(page.getByText(/2\/5/)).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Responsive', () => {
  test('game remains usable on tablet viewport', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Játék indítása|Start Game/ }).click()

    await expect(page.getByRole('button', { name: /FELVESZ|HIRE/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /ELUTASÍT|REJECT/ })).toBeVisible()
    await expect(page.getByText(/1\/5/)).toBeVisible()
  })
})

test.describe('Sound Toggle', () => {
  test('mute button toggles icon', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Játék indítása|Start Game/ }).click()

    const mute = page.getByRole('button', { name: /🔊|🔇/ })
    await expect(mute).toBeVisible()
    const before = await mute.textContent()
    await mute.click()
    const after = await mute.textContent()
    expect(after).not.toBe(before)
  })
})
