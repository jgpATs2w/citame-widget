import { AppPage } from './app.po';

describe('citame-widget App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should show login page', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('citame.click');
  });
});
