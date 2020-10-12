import React from 'react';
import faker from 'faker';
import { Provider } from 'react-redux';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { screen, render } from '@testing-library/react';

import { makeMockStore } from '@/utils/helpers';

import ProductList from './product-list';

const makeSut = (store) => {
  const router: any = {
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
  };

  render(
    <Provider store={makeMockStore(store)}>
      <RouterContext.Provider value={router}>
        <ProductList />
      </RouterContext.Provider>
    </Provider>
  );
};

describe('ProductList Component', () => {
  const store = {
    search: {
      data: {
        items: [
          {
            id: faker.random.number(),
            title: faker.commerce.productName(),
            price: {
              amount: faker.random.number(),
            },
            state: faker.address.state(),
          },
        ],
        categories: [faker.random.word(), faker.random.word()],
      },
      loading: false,
      error: false,
    },
    product: {
      data: {
        item: {},
        categories: [],
      },
      loading: false,
      error: false,
    },
  };

  it('should start with initial state', () => {
    makeSut(store);

    const input = screen.getByPlaceholderText(
      `Nunca dejes de buscar`
    ) as HTMLInputElement;

    expect(input).toHaveAttribute('value', '');
  });

  it('should list the correct categories', () => {
    makeSut(store);

    const breadcrumbs = screen.getByTestId('breadcrumbs');

    expect(breadcrumbs).toHaveTextContent(store.search.data.categories[0]);
    expect(breadcrumbs).toHaveTextContent(store.search.data.categories[1]);
  });

  it('should list the products with correct values', () => {
    makeSut(store);

    const {
      search: { data: search },
    } = store;

    const productList = screen.getByTestId('product-list');

    const price = `${search.items[0].price.amount}`.slice(0, 2);
    const priceAfterPoint = `${search.items[0].price.amount}`.slice(2);

    expect(productList).toHaveTextContent(`$ ${price}.${priceAfterPoint}00`);
    expect(productList).toHaveTextContent(search.items[0].title);
    expect(productList).toHaveTextContent(search.items[0].state);
  });
});