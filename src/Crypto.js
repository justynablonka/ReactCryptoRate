import React, { Component } from 'react';
import './Crypto.css';

import axios from 'axios';
import CryptoList from './CryptoList';

class Crypto extends Component {

    constructor(props) {
        super(props);

        //za każdym pobraniem danych będzie uzupełniać w state cryptoList i za każdym wciśnięciem klawisza
        //będzie uruchamiać się metoda filtrująca i będzie pojawiać się tablica z elementami spełniającymi warunki
        this.state = {
            cryptoList: [],
            filteredCryptoList: []
        };
    }

    componentDidMount() {
        this.getCryptoData();
        this.timerID = setInterval(() => this.getCryptoData(), 5000);
        //timery uruchamia się w componentDidMount, kiedy komponent już się zamontował
    }

    componentWillUnmount() { //tu musimy wyczyścić nasz timer
        clearInterval(this.timerID);
    }

    getCryptoData = () => {

        axios.get('https://blockchain.info/pl/ticker')
            .then(response => {
                const tickers = response.data;
                console.log(response.data); //dostajemy dane z kursami (dzięki polu data obiektu)

                this.setState((state) => {
                    let newCryptoList = [];

                    //metoda entries na klasie Object zwraca dla każdego elementu tablicę, 
                    //gdzie kluczem jest ticker, i wartość, czyli obiekt w którym przechowywane są kursy
                    for (const [ticker, cryptoRate] of Object.entries(tickers)) {

                        //do określenia która strzałka
                        //find - podobnie jak filter - przyjmuje funkcję jako parametr
                        //będziemy szli po każdym polu naszego stanu (naszej tablicy) i każdy element
                        //tablicy będzie wstrzykiwany do funkcji wyszukującej jako paramter (cryptoObj)
                        let lastCryptoObj = state.cryptoList.find((cryptoObj) => {
                            return (cryptoObj.currency === ticker); //będzie zwracać true lub false
                        })

                        //console.log(lastCryptoObj);

                        let newCryptoObj = {
                            currency: ticker,
                            symbol: cryptoRate.symbol,
                            buy: cryptoRate.buy,
                            sell: cryptoRate.sell,
                            lastRate: cryptoRate.last,
                        }

                        if (lastCryptoObj !== undefined) {
                            //jak tworzymy (w I state) pustą tablicę 
                            //to undefined, ale jak będziemy odświeżać co parę sekund to będzie już uzupełniony
                            if (newCryptoObj.lastRate > lastCryptoObj.lastRate) {
                                newCryptoObj.cssClass = 'green';
                                newCryptoObj.htmlArray = String.fromCharCode(8593);
                            }
                            else if (newCryptoObj.lastRate < lastCryptoObj.lastRate) {
                                newCryptoObj.cssClass = 'red';
                                newCryptoObj.htmlArray = String.fromCharCode(8595);
                            }
                            else {
                                newCryptoObj.cssClass = 'blue';
                                newCryptoObj.htmlArray = String.fromCharCode(8596); //kod html płaskiej strzałki
                            }
                        } else {
                            newCryptoObj.cssClass = 'blue';
                            newCryptoObj.htmlArray = String.fromCharCode(8596); //kod html płaskiej strzałki
                        }

                        newCryptoList.push(newCryptoObj);
                    }

                    return ({
                        cryptoList: newCryptoList //dodajemy dane do stanu, dzięki temu możemy przekazać
                        //je przez propsy do cryptoList (ten plik w return - lin. ~59)
                    })
                });
                this.filterCryptoList();
            });
    }

    filterCryptoList = () => {
        console.log(this._inputFilter.value);
    }

    filterCryptoList = () => {
        this._inputFilter.value = this._inputFilter.value.trim().toUpperCase();

        this.setState((state) => {
            let newFilteredCryptoList = this.state.cryptoList.filter((cryptoObj) => {
                return (cryptoObj.currency.includes(this._inputFilter.value));
            });

            return ({
                filteredCryptoList: newFilteredCryptoList
            });
        });
    }

    render() {
        return (
            <div className="Crypto">
                <input ref={element => this._inputFilter = element} onChange={this.filterCryptoList}
                    type="text" placeholder="Filter" />
                <CryptoList cryptoList={this.state.filteredCryptoList} />
            </div>
        );
    }
}

export default Crypto;