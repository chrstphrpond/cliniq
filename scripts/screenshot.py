"""Capture screenshots of the Cliniq design-system showcase in light + dark."""

from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path("docs/screenshots")
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, theme: str, route: str, name: str, width: int = 1440, height: int = 900):
    page.set_viewport_size({"width": width, "height": height})
    page.goto(f"http://localhost:3000{route}")
    page.wait_for_load_state("networkidle")
    page.evaluate(f'document.documentElement.dataset.theme = "{theme}"')
    page.wait_for_timeout(200)
    out = OUT / f"{name}-{theme}-{width}.png"
    page.screenshot(path=str(out), full_page=True)
    print(f"  wrote {out}")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context()
        page = ctx.new_page()

        for theme in ("light", "dark"):
            print(f"theme={theme}")
            shot(page, theme, "/", "home", 1440, 900)
            shot(page, theme, "/design-system", "design-system", 1440, 1800)
            shot(page, theme, "/design-system", "design-system-tablet", 768, 1600)
            shot(page, theme, "/design-system", "design-system-mobile", 390, 1600)

        # Focus state on Input
        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto("http://localhost:3000/design-system")
        page.wait_for_load_state("networkidle")
        page.evaluate('document.documentElement.dataset.theme = "light"')
        page.locator('input[placeholder="Search patients"]').focus()
        page.wait_for_timeout(150)
        page.screenshot(path=str(OUT / "input-focus-light-1440.png"), full_page=False)
        print("  wrote input-focus-light-1440.png")

        # Hover state on solid button
        page.evaluate('document.documentElement.dataset.theme = "light"')
        btn = page.get_by_role("button", name="Solid md")
        btn.hover()
        page.wait_for_timeout(150)
        page.screenshot(path=str(OUT / "button-hover-light-1440.png"), full_page=False)
        print("  wrote button-hover-light-1440.png")

        browser.close()


if __name__ == "__main__":
    main()
