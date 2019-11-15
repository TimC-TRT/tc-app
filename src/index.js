import React from 'react';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import { SSL_OP_NO_TLSv1_2 } from 'constants';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';


import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';


function Square(props) {
    return (
        <button className={"square " + (props.win ? " squarewin" : "")}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                win={calculateWinner(this.props.squares, i).winNum}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />);
    }

    render() {
        let squares = [];
        let num = 0;
        for (let i = 0; i < 3; i++) {
            let row = [];

            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(num));
                num++;
            }
            squares.push(<div className="board-row">{row}</div>)
        }
        let fred = 'fred1';
        let arr = [];
        arr.push(this.renderSquare(1));
        arr.push(this.renderSquare(2));
        let notarr = this.renderSquare(2);
        return (
            <div>
                <div>{squares}</div>
                <div>
                    {fred}
                    {/*arr*/}
                    {/*notarr*/}

                </div>
            </div>
            /*
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
            */

        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squares: Array(9).fill(null), row: 0, col: 0 }
            ],
            stepNumber: 0,
            xIsNext: true,
            isDescending: true
        };
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    sortHistory() {
        this.setState(
            { isDescending: !this.state.isDescending }
        );
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        var row = Math.floor(i / 3) + 1;
        var col = (i % 3) + 1;


        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares, row: row, col: col
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });

    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).winner;

        const moves = history.map((step, move) => {
            const row = step.row;
            const col = step.col;
            const desc = move ?
                'Go to move #' + move + ' row ' + row
                + ' col ' + col :
                'Go to game start';
            return (
                <li key={move}>
                    <Button variant="danger" onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b> {desc} </b> : desc}
                    </Button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else if (!current.squares.includes(null)) {
            status = "draw";
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (

            <div className="game">
                <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
                </div>
                <div className="game-board">
                    <Container className="p-3">
                        <Board squares={current.squares}
                            onClick={(i) => this.handleClick(i)} />
                    </Container>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
                    <Button onClick={() => this.sortHistory()}>
                        Sort by: {this.state.isDescending ? "Descending" : "Asending"}
                    </Button>
                </div>
            </div>
        );
    }
}



function calculateWinner(squares, squareNum = 0) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    let winNum = false;
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            if (a == squareNum || b == squareNum || c == squareNum) {
                winNum = true;
            }
            return { winner: squares[a], winNum: winNum };
        }
    }
    return { winner: null, winNum: false };
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
