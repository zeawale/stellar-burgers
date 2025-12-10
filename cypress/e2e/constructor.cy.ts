import { TIngredient } from '../../src/utils/types';

describe('E2E тесты конструктора бургеров', () => {
  let items: TIngredient[];

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      return false;
    });

    cy.intercept(
      'GET',
      'https://norma.education-services.ru/api/ingredients',
      { fixture: 'ingredients.json' }
    ).as('getIngredients');

    cy.intercept(
      'GET',
      'https://norma.education-services.ru/api/auth/user',
      { fixture: 'user.json' }
    ).as('authUser');

    cy.intercept(
      'POST',
      'https://norma.education-services.ru/api/orders',
      { fixture: 'order.json' }
    ).as('createOrder');

    cy.setCookie('accessToken', 'testAccess');
    localStorage.setItem('refreshToken', 'testRefresh');

    cy.visit('http://localhost:4000/profile');

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
    cy.get('[data-cy=order-price] p').should('have.text', total.toString());

    cy.contains(sauce.name)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.get('[data-cy=constructor-ingredients]')
      .contains(sauce.name, { timeout: 10000 })
      .should('exist');

    total += sauce.price;
    cy.get('[data-cy=order-price] p').should('have.text', total.toString());

    cy.contains(main.name)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.get('[data-cy=constructor-ingredients]')
      .contains(main.name, { timeout: 10000 })
      .should('exist');

    total += main.price;
    cy.get('[data-cy=order-price] p').should('have.text', total.toString());
  });

  // 2. Открытие модалки ингредиента

  it('Открытие модального окна ингредиента', () => {
    const sauce = items.find((i) => i.type === 'sauce')!;

    cy.contains(sauce.name).click();

    cy.get('[data-cy=modal]', { timeout: 10000 }).should('exist');
    cy.get('[data-cy=modal-title]').should('contain', 'Детали ингредиента');
  });

  // 3. Закрытие модалки крестиком

  it('Закрытие модалки по крестику', () => {
    const main = items.find((i) => i.type === 'main')!;

    cy.contains(main.name).click();
    cy.get('[data-cy=modal]', { timeout: 10000 }).should('exist');

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  // 4. Закрытие модалки overlay

  it('Закрытие модалки по overlay', () => {
    const bun = items.find((i) => i.type === 'bun')!;

    cy.contains(bun.name).click();
    cy.get('[data-cy=modal]', { timeout: 10000 }).should('exist');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  // 5. Закрытие модалки Esc

  it('Закрытие модалки по Esc', () => {
    const sauce = items.find((i) => i.type === 'sauce')!;

    cy.contains(sauce.name).click();
    cy.get('[data-cy=modal]', { timeout: 10000 }).should('exist');

    cy.get('body').type('{esc}');
    cy.get('[data-cy=modal]').should('not.exist');
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

    cy.get('[data-cy=make-order-btn]').click();

    cy.wait('@createOrder', { timeout: 10000 }).then((res) => {
      const number = res.response?.body.order.number;
      cy.contains(number.toString(), { timeout: 10000 }).should('exist');
    });

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.contains(`${bun.name} (верх)`).should('not.exist');
    cy.contains(`${bun.name} (низ)`).should('not.exist');
  });
});
