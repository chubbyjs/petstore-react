import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale'
import qs from 'qs';
import PetList from '../../../Type/Pet/PetList';
import Pet from '../../../Type/Pet/Pet';
import BadRequest from '../../../Type/Error/BadRequest';
import { Button, Pagination, PaginationProps } from 'semantic-ui-react';
import { ListPets, DeletePet } from '../../../ApiClient/Pet';
import PageBadRequest from '../Error/BadRequest';

const List = () => {

    const history = useHistory();
    const location = useLocation();

    const query = qs.parse(location.search.substr(1));

    const page = parseInt(query.page ? query.page : '1');
    const offset = (page * 10) - 10;
    const filters = query.filters ? query.filters : {};
    const sort = query.sort ? query.sort : {};

    const queryString = qs.stringify({ limit: 10, offset: offset, filters: filters, sort: sort });

    const [petList, setPetList] = useState<PetList | BadRequest>();

    useEffect(() => {
        const fetchPetList = async () => {
            setPetList(await ListPets(queryString));
        };

        fetchPetList();

        document.title = 'List Pets';
    }, [queryString]);

    const deletePet = async (pet: Pet) => {
        await DeletePet(pet);

        setPetList(await ListPets(queryString));
    };

    const changePage = (e: any, data: PaginationProps) => {
        history.push(`/pet?${qs.stringify({ ...query, page: data.activePage })}`);
    };

    if (!petList) {
        return (
            <main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-4'></main>
        );
    }

    if (petList instanceof BadRequest) {
        return (
            <PageBadRequest invalidParameters={petList.invalidParameters} />
        );
    }

    const pages = Math.ceil(petList.count / petList.limit);

    return (
        <main className='ui padded grid'>
            <div className='row'>
                <h1 className='ui huge dividing header'>List Pets</h1>
            </div>
            {petList._links.create ? (
                <div className='row'>
                    <Button as={Link} to='/pet/create' className='green'>Create</Button>
                </div>
            ) : ''}
            <div className='row'>
                <Pagination defaultActivePage={page} totalPages={pages} onPageChange={changePage} />
                <table className='ui single line striped selectable table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>
                                Name (
                                <Link to={`/pet?${qs.stringify({ ...query, ...filters, sort: { ...sort, name: 'asc' } })}`}> A-Z </Link> |
                                <Link to={`/pet?${qs.stringify({ ...query, ...filters, sort: { ...sort, name: 'desc' } })}`}> Z-A </Link> |
                                <Link to={`/pet?${qs.stringify({ ...query, ...filters, sort: { ...sort, name: undefined } })}`}> --- </Link>
                                )
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {petList._embedded.items.map((pet: Pet) => (
                            <tr key={pet.id}>
                                <td>{pet.id}</td>
                                <td>{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</td>
                                <td>{pet.updatedAt && format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</td>
                                <td>{pet.name}</td>
                                <td>
                                {pet._links.read ? (
                                    <Button as={Link} to={`/pet/${pet.id}`}>Read</Button>
                                ) : ''}
                                {pet._links.update ? (
                                    <Button as={Link} to={`/pet/${pet.id}/update`}>Update</Button>
                                ) : ''}
                                {pet._links.delete ? (
                                    <Button onClick={() => { deletePet(pet) }} className='red'>Delete</Button>
                                ) : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination defaultActivePage={page} totalPages={pages} onPageChange={changePage} />
            </div>
        </main>
    );
}

export default List;
