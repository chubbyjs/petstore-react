import React from 'react';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import * as ApiClientPet from '../../../../ApiClient/Pet';
import HttpError from '../../../../Model/Error/HttpError';
import NotFound from '../../../../Model/Error/NotFound';
import PetFormProps from '../../../../Component/Form/PetFormProps';
import PetResponse from '../../../../Model/Pet/PetResponse';
import UnprocessableEntity from '../../../../Model/Error/UnprocessableEntity';
import Update from '../../../../Component/Page/Pet/Update';
import Vaccination from '../../../../Model/Pet/Vaccination';

jest.mock('../../../../ApiClient/Pet');

jest.mock('../../../../Component/Form/PetForm', () => {
    return ({ submitPet }: PetFormProps) => {
        const submit = async () => {
            await submitPet({ name: '', vaccinations: [] });
        };

        return (<button data-testid="test-button" onClick={submit}></button>);
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div>httpError: {httpError.title}</div>);
    };
});

test('not found', async () => {
    ApiClientPet.ReadPet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new NotFound({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await findByTestId('page-pet-update');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-update">
                <div>httpError: title</div>
                <h1>Update Pet</h1>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('minimal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie'
    });

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    await findByTestId('page-pet-update');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-update">
                <h1>Update Pet</h1>
                <button data-testid="test-button"></button>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('unprocessable entity', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    ApiClientPet.UpdatePet.mockResolvedValueOnce(new Promise((resolve) => {
        resolve(new UnprocessableEntity({ title: 'title' }));
    }));

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { container, findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-update">
                <div>httpError: title</div>
                <h1>Update Pet</h1>
                <button data-testid="test-button"></button>
                <a class="btn-gray" href="/pet">List</a>
            </div>
        </div>
    `.replace(/\n {2,}/g, ''));
});

test('successful', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    ApiClientPet.ReadPet.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(pet));
    });

    ApiClientPet.UpdatePet.mockImplementationOnce((pet: PetResponse) => {
        return new Promise((resolve) => resolve(pet));
    });

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        }
    };

    const { findByTestId } = render(
        <Router history={history}>
            <Update match={match} />
        </Router>
    );

    expect(history.location.pathname).toBe('/');

    const testButton = await findByTestId('test-button');

    fireEvent.click(testButton);

    await findByTestId('test-button');

    expect(history.location.pathname).toBe('/pet');
});
