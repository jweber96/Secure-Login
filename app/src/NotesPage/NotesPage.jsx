import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import { userActions } from '../_actions';

import './NotesPage.css';


class NotesPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            note: '',
            Notes: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getCookie = (name) => {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    componentDidMount() {
        axios('http://localhost:3000/user', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'Origin',
                'auth': this.getCookie('auth')
            }
        }).then((res) => {
            res.data.Notes.forEach(note => {
                note.CreatedAt = note.CreatedAt.split("T")[0];
            });
            this.setState(res.data);
        });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    handleSubmit() {
        axios('http://localhost:3000/user/newNote', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'Origin',
                'auth': this.getCookie('auth')
            },
            data: {
                'note': this.state.note
            }
        })
        .then(function (response) {
            if (response.status == 200) {
                console.log(response);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        let columns = [{
            Header: 'Created',
            accessor: 'CreatedAt'
        },{
            Header: 'Note',
            accessor: 'Note'
        }];
        const { note } = this.state;
        return (
            <div className="Notes">
                <div className="col-md-2 col-md-offset-5">
                    Notes<br/><i class="material-icons library_add">library_add</i>
                </div>
                <div className="col-md-6 col-md-offset-3">
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group'}>
                            <div class="input">
                                <div class="input-addon">
                                    <i class="material-icons">note_add</i>
                                </div>
                                <label htmlFor="note">Note</label>
                                <input type="text" className="form-control" name="note" placeholder="Type note here" value={note} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="NoteButton">
                                <button className="btn btn-primary">Create Note</button>
                            </div>
                        </div>
                    </form>
                    <ReactTable
                        data={this.state.Notes}
                        columns={columns}
                    />
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const actionCreators = {
    login: userActions.login,
    logout: userActions.logout
};

const connectedNotesPage = connect(mapState, actionCreators)(NotesPage);
export { connectedNotesPage as NotesPage };