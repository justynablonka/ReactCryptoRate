import React from 'react';
import './CryptoList.css';

function CryptoList(props) {

    let cryptoList = props.cryptoList; //pobieramy listę kursów z propsów

    //przelecimy przez tablicę cryptoList i za pomocą mapy stworzymy nowe elementy, które wejdą do nowej
    //tablicy zawierającej elementy li; na końcu wstrzykniemy dane zamiast wpisywać z palca
    let liElements = cryptoList.map((cryptoObj) => {
        return(
            <li key={cryptoObj.currency}>
            <span className="CryptoLabel">Last rate: </span>
            <span className={`CryptoRate ${cryptoObj.cssClass}`}>{cryptoObj.lastRate} {cryptoObj.htmlArray}</span>
            <span className="CurrencyTicker">{cryptoObj.currency}</span>
            <span className="CurrencySymbol">[{cryptoObj.symbol}]</span>
        </li>
        );
    })

    //console.log(cryptoList);

    return (
        <div className="CryptoList">
            <ul className="TheList">
                {liElements};
            </ul>
        </div>
    )

}

export default CryptoList;