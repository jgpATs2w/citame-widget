import { browser, by, element, until } from 'protractor';

describe('/calendario', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  it('should show calendario page', () => {

    browser.get('/login?clinica_id=1');
    expect(element(by.css('h1')).getText()).toEqual('citame.click');
    element(by.css('button.login-email')).click();
    element(by.css('.login-email-input')).sendKeys('jgp@sens2web.es');
    element(by.css('.login-password-input')).sendKeys('jgp134679');

    element(by.css('button.login-submit')).click();
  });

  it('should allow navigate to day', () => {

    browser.get('/calendario?clinica_id=1');
    element(by.css('.cal-header.cal-today')).click();

    browser.wait(until.elementLocated(by.css('.cal-hour-segment')), 5000);

  });
  it('should allow change view', () => {

      browser.get('/calendario?clinica_id=1');
      element(by.css('.cal-header.cal-today')).click();
      element(by.cssContainingText('.mat-select-value', 'Día')).click();
      browser.wait(until.elementLocated(by.css('.cal-hour-segment')), 5000);

    });
});
