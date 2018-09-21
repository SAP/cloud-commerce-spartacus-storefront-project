import { AppPage } from './app.po';
import { browser, by, element, ElementFinder } from 'protractor';
import { E2EUtil } from '../e2e-util';
import { CategoryDslrPage } from './category-dslr.po';

export class HomePage extends AppPage {
  readonly YPAGE = 'y-home-page';

  readonly page: ElementFinder = element(by.tagName(this.YPAGE));
  readonly splashBanner: ElementFinder = this.page.element(
    by.css('.ElectronicsHompageSplashBannerComponent')
  );

  async navigateTo() {
    await browser.get('/');
    await this.waitForReady();
  }

  async waitForReady() {
    await E2EUtil.wait4VisibleElement(this.page);
  }

  async navigateViaSplashBanner() {
    await this.splashBanner.click();
    return new CategoryDslrPage();
  }
}
