import { browser, by, element, until } from 'protractor';

describe('/login', () => {
  beforeEach(() => {
    browser.get('/login');
  });

  it('should show login page', () => {

    expect(element(by.css('h1')).getText()).toEqual('citame.click');
  });

  it('should allow login with email and password', () => {

    element(by.css('button.login-email')).click();

    browser.wait(until.elementLocated(by.css('.login-email-input')), 5000);
    element(by.css('.login-email-input')).sendKeys('jgp@sens2web.es');
    element(by.css('.login-password-input')).sendKeys('jgp134679f');

    element(by.css('button.login-submit')).click();

    expect(browser.getCurrentUrl()).toContain('/login');//TODO update route
  });
});
