import React from 'react';
import ReactRouterDom, { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

ReactRouterDom.BrowserRouter = ({children}) => <div>{children}</div>

jest.mock('../Component/Page/Home', () => {
    return () => {
        return (<div data-testid="page-home-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/List', () => {
    return () => {
        return (<div data-testid="page-pet-list-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/Create', () => {
    return () => {
        return (<div data-testid="page-pet-create-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/Read', () => {
    return () => {
        return (<div data-testid="page-pet-read-mock"></div>);
    };
});

jest.mock('../Component/Page/Pet/Update', () => {
    return () => {
        return (<div data-testid="page-pet-update-mock"></div>);
    };
});

jest.mock('../Component/Page/NotFound', () => {
    return () => {
        return (<div data-testid="page-not-found-mock"></div>);
    };
});

test('toggle', async () => {
    const { container, findByTestId } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    const navigationToggle = await findByTestId('navigation-toggle');

    fireEvent.click(navigationToggle);

    await findByTestId('navigation-toggle');

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="displayMenu">
                    <nav id="top-nav" class="clearfix">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-home-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('home page', () => {
    const { container } = render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-home-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('not found', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/unknown']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-not-found-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet list', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-list-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet create', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/create']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-create-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet read', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-read-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('pet update', () => {
    const { container } = render(
        <MemoryRouter initialEntries={['/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update']}>
            <App />
        </MemoryRouter>
    );

    expect(container.outerHTML).toBe(`
        <div>
            <div>
                <div id="wrapper" class="">
                    <nav id="top-nav" class="clearfix">
                        <button id="toggle" data-testid="navigation-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <a aria-current="page" class="active" href="/">Petstore</a>
                    </nav>
                    <nav id="left-nav">
                        <ul>
                            <li>
                                <a aria-current="page" class="active" href="/pet">Pets</a>
                            </li>
                        </ul>
                    </nav>
                    <div id="main">
                        <div data-testid="page-pet-update-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});
