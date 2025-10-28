import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ItemCounter } from "./ItemCounter";

describe('ItemCounter', () => {
    test("Deberia renderizar un elemento por defecto", () => {
        const name = "Test Item"
        // Renderizamos el item counter para construir un elemento
        // del tipo item counter
        // El render genera un elemento screen automaticamente
        render(<ItemCounter name={name}/>)
        // screen.debug()
        //  toBeDefined -> Veiamos la existencia de ese elemento detro de mi DOM
        // el getByText busca un elemento por el texto que se encuentra dentro de 
        // la etiqueta de HTML, pero solamente busca un elemento unico, si existe
        // mas de uno este método generará un error de búsqueda, por lo cual se 
        // debe utilizar getAllByText(name) u otro similar
        expect(screen.getByText(name)).toBeDefined();
        // not.toBeNull -> <h1 data-tesid="algo"></h1> ese valor sera nulo porque
        // el h1 no contiene un valor dentro.
        expect(screen.getByText(name)).not.toBeNull();

    });

    test("Deberia renderizar un elemento con una cantidad por defecto", () => {
        const name = "Test Item"
        const quantity = 10

        // renderizaba el ItemCounter tanto con name como con quantity
        render(<ItemCounter name={name} quantity={quantity}/>)
        // screen.debug();

        // Buscaba por texto la cantidad, en caso que exista esta cantidad
        // la prueba esta completada
        expect(screen.getByText(quantity)).toBeDefined();
    });

    test("Deberia incrementar en 1 cuando hago clic en +1", () => {
        const name = "Test Item"
        const quantity = 10
        render(<ItemCounter name={name} quantity={quantity}/>)
        // Obtengo todos los botones 
        const buttons = screen.getAllByRole('button');
        // Destructuracion de una lista, para obtener el boton +1
        const [btnAdd] = buttons;
        // console.log(btnAdd.innerHTML, btnSubs.innerHTML)
        // Si quiero simular un eveto ocupo 
        // fireEvent.(el evento que quiero)(element)
        fireEvent.click(btnAdd)
        // Realizo la comprobación que realmente aumento en 1 el valor
        expect(screen.getByText('11')).toBeDefined()
    });

    test("Deberia disminuir en 1 cuando hago clic en -1", () => {
        const name = "Test Item"
        const quantity = 10
        render(<ItemCounter name={name} quantity={quantity}/>)
        const buttons = screen.getAllByRole('button');
        // console.log(buttons)
        const [,btnSubs] = buttons;
        // console.log(btnAdd.innerHTML, btnSubs.innerHTML)
        fireEvent.click(btnSubs)
        expect(screen.getByText('9')).toBeDefined()
    });

    test("Deberia disminuir en 1 cuando hago clic en -1 cuando me tengo por cantidad 1", () => {
        const name = "Test Item"
        const quantity = 1
        render(<ItemCounter name={name} quantity={quantity}/>)
        const buttons = screen.getAllByRole('button');
        // console.log(buttons)
        // Destructuro una lista con dos posiciones btn +1 y btn -1 
        // [btnAdd] ==> posicion 0
        // [btnAdd, btnSubs] ==> posicion 0 y 1
        // [,btnSubs] ==> posicion 1
        const [,btnSubs] = buttons;
        // console.log(btnAdd.innerHTML, btnSubs.innerHTML)
        fireEvent.click(btnSubs);
        //screen.debug();
        expect(screen.getByText('1')).toBeDefined();
    
    });

    test("Deberia cambiar a rojo cuando la cantidad es 1", ()=>{
        const name = "Test Item";
        const quantity = 1;

        // Renderizando el elemento de prueba tanto con el nombre
        // como con la cantidad
        render(<ItemCounter name={name} quantity={quantity}/>)
    
        // Busco el elemento por el texto imprido de item text
        const spanText = screen.getByText(name);
        expect(spanText.style.color).toBe('red');

    });
    test("Deberia cambiar a negro cuando presiono el +1", ()=>{
        const name = "Test Item";
        const quantity = 1;

        // Renderizando el elemento de prueba tanto con el nombre
        // como con la cantidad
        render(<ItemCounter name={name} quantity={quantity}/>)
    
        // Busco el elemento por el texto imprido de item text
        const spanText = screen.getByText(name);
        const [btnAdd] = screen.getAllByRole('button');
        fireEvent.click(btnAdd)
        expect(spanText.style.color).toBe('black');

    });

});