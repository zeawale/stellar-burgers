import { TIngredient } from '../../src/utils/types';
const testUrl = 'http://localhost:4000';
const SELECTORS = {
  modal: '[data-cy=modal]',
  modalTitle: '[data-cy=modal-title]',
  modalClose: '[data-cy=modal-close]',
  modalOverlay: '[data-cy=modal-overlay]',
  constructorIngredients: '[data-cy=constructor-ingredients]',
  orderPrice: '[data-cy=order-price] p',
  makeOrderBtn: '[data-cy=make-order-btn]',
};
describe('E2E тесты конструктора бургеров', () => {
  let items: TIngredient[];

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      return false;
    });

    cy.intercept(
      'GET',
      'api/ingredients',
      { fixture: 'ingredients.json' }
    ).as('getIngredients');

    cy.intercept(
      'GET',
      'api/auth/user',
      { fixture: 'user.json' }
    ).as('authUser');

    cy.intercept(
      'POST',
      'api/orders',
      { fixture: 'order.json' }
    ).as('createOrder');

    cy.setCookie('accessToken', 'testAccess');
    localStorage.setItem('refreshToken', 'testRefresh');

    cy.visit(`${testUrl}/profile`);

    cy.wait('@authUser', { timeout: 10000 });

    cy.contains('Тестовый Пользователь', { timeout: 10000 }).should('exist');

    cy.contains('Конструктор').click();

    cy.wait('@getIngredients', { timeout: 10000 }).then((res) => {
      items = res.response?.body.data;
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearAllLocalStorage();
  });

  // 1. Добавление ингредиентов

  it('Добавление булки, соуса и начинки', () => {
    const bun = items.find((i) => i.type === 'bun')!;
    const sauce = items.find((i) => i.type === 'sauce')!;
    const main = items.find((i) => i.type === 'main')!;

    let total = 0;

    cy.contains(bun.name)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.contains(`${bun.name} (верх)`, { timeout: 10000 }).should('exist');
    cy.contains(`${bun.name} (низ)`).should('exist');

    total += bun.price * 2;
    cy.get(SELECTORS.orderPrice).should('have.text', total.toString());

    cy.contains(sauce.name)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.get(SELECTORS.constructorIngredients)
      .contains(sauce.name, { timeout: 10000 })
      .should('exist');

    total += sauce.price;
    cy.get(SELECTORS.orderPrice).should('have.text', total.toString());

    cy.contains(main.name)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.get(SELECTORS.constructorIngredients)
      .contains(main.name, { timeout: 10000 })
      .should('exist');

    total += main.price;
    cy.get(SELECTORS.orderPrice).should('have.text', total.toString());
  });

  // 2. Открытие модалки ингредиента

  it('Открытие модального окна ингредиента', () => {
    const sauce = items.find((i) => i.type === 'sauce')!;

    cy.contains(sauce.name).click();

    cy.get(SELECTORS.modal, { timeout: 10000 }).should('exist');
    cy.get(SELECTORS.modalTitle).should('contain', 'Детали ингредиента');
  });

  // 3. Закрытие модалки крестиком

  it('Закрытие модалки по крестику', () => {
    const main = items.find((i) => i.type === 'main')!;

    cy.contains(main.name).click();
    cy.get(SELECTORS.modal, { timeout: 10000 }).should('exist');

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  // 4. Закрытие модалки overlay

  it('Закрытие модалки по overlay', () => {
    const bun = items.find((i) => i.type === 'bun')!;

    cy.contains(bun.name).click();
    cy.get(SELECTORS.modal, { timeout: 10000 }).should('exist');

    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  // 5. Закрытие модалки Esc

  it('Закрытие модалки по Esc', () => {
    const sauce = items.find((i) => i.type === 'sauce')!;

    cy.contains(sauce.name).click();
    cy.get(SELECTORS.modal, { timeout: 10000 }).should('exist');

    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modal).should('not.exist');
  });

  // 6. Оформление заказа

  it('Оформление заказа', () => {
    const bun = items.find((i) => i.type === 'bun')!;
    const sauce = items.find((i) => i.type === 'sauce')!;
    const main = items.find((i) => i.type === 'main')!;

    [bun, sauce, main].forEach((ingredient) => {
      cy.contains(ingredient.name)
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });
    });

    cy.get(SELECTORS.makeOrderBtn).click();

    cy.wait('@createOrder', { timeout: 10000 }).then((res) => {
      const number = res.response?.body.order.number;
      cy.contains(number.toString(), { timeout: 10000 }).should('exist');
    });

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');

    cy.contains(`${bun.name} (верх)`).should('not.exist');
    cy.contains(`${bun.name} (низ)`).should('not.exist');
  });
});
