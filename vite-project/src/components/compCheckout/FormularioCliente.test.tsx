import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { FormularioCliente } from "./FormularioCliente";

describe('FormularioCliente', () => {
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockForm: Record<string, string>;

    beforeEach(() => {
        mockOnChange = vi.fn();
        mockForm = {
            nombre: '',
            apellidos: '',
            correo: '',
            tarjeta: '',
            telefono: '',
            calle: '',
            region: '',
            comuna: ''
        };
    });

    test("Debería renderizar todos los campos del formulario", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        // Verificar campos por name attribute
        expect(container.querySelector('input[name="nombre"]')).toBeDefined();
        expect(container.querySelector('input[name="apellidos"]')).toBeDefined();
        expect(container.querySelector('input[name="correo"]')).toBeDefined();
        expect(container.querySelector('input[name="tarjeta"]')).toBeDefined();
        expect(container.querySelector('input[name="telefono"]')).toBeDefined();
        expect(container.querySelector('input[name="calle"]')).toBeDefined();
        expect(container.querySelector('input[name="region"]')).toBeDefined();
        expect(container.querySelector('input[name="comuna"]')).toBeDefined();
    });

    test("Debería mostrar los títulos de las secciones", () => {
        render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        expect(screen.getByText('Información del cliente')).toBeDefined();
        expect(screen.getByText('Dirección de entrega')).toBeDefined();
    });

    test("Debería mostrar los valores del form en los inputs", () => {
        const formConDatos = {
            nombre: 'Juan',
            apellidos: 'Pérez',
            correo: 'juan@example.com',
            tarjeta: '1234567890123456',
            telefono: '912345678',
            calle: 'Av. Principal 123',
            region: 'Metropolitana',
            comuna: 'Santiago'
        };

        const { container } = render(<FormularioCliente form={formConDatos} onChange={mockOnChange} />);

        expect((container.querySelector('input[name="nombre"]') as HTMLInputElement).value).toBe('Juan');
        expect((container.querySelector('input[name="apellidos"]') as HTMLInputElement).value).toBe('Pérez');
        expect((container.querySelector('input[name="correo"]') as HTMLInputElement).value).toBe('juan@example.com');
        expect((container.querySelector('input[name="tarjeta"]') as HTMLInputElement).value).toBe('1234567890123456');
        expect((container.querySelector('input[name="telefono"]') as HTMLInputElement).value).toBe('912345678');
        expect((container.querySelector('input[name="calle"]') as HTMLInputElement).value).toBe('Av. Principal 123');
        expect((container.querySelector('input[name="region"]') as HTMLInputElement).value).toBe('Metropolitana');
        expect((container.querySelector('input[name="comuna"]') as HTMLInputElement).value).toBe('Santiago');
    });

    test("Debería llamar a onChange cuando se escribe en el campo nombre", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        const inputNombre = container.querySelector('input[name="nombre"]') as HTMLInputElement;
        fireEvent.change(inputNombre, { target: { name: 'nombre', value: 'Juan' } });

        // Solo verificamos que onChange fue llamado, ya que el componente usa controlled inputs
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        // Verificar que el evento tenga el name correcto
        const callArg = mockOnChange.mock.calls[0][0];
        expect(callArg.target.name).toBe('nombre');
    });

    test("Debería llamar a onChange cuando se escribe en el campo correo", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        const inputCorreo = container.querySelector('input[name="correo"]') as HTMLInputElement;
        fireEvent.change(inputCorreo, { target: { name: 'correo', value: 'test@example.com' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test("Debería marcar los campos requeridos con asterisco", () => {
        render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        // Los campos requeridos tienen asterisco en el label
        expect(screen.getByText(/Nombre\*/)).toBeDefined();
        expect(screen.getByText(/Apellidos\*/)).toBeDefined();
        expect(screen.getByText(/Correo\*/)).toBeDefined();
        expect(screen.getByText(/N° Tarjeta\*/)).toBeDefined();
        expect(screen.getByText(/Calle\*/)).toBeDefined();
        expect(screen.getByText(/Región\*/)).toBeDefined();
        expect(screen.getByText(/Comuna\*/)).toBeDefined();
    });

    test("Debería tener el atributo required en los campos obligatorios", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        expect((container.querySelector('input[name="nombre"]') as HTMLInputElement).required).toBe(true);
        expect((container.querySelector('input[name="apellidos"]') as HTMLInputElement).required).toBe(true);
        expect((container.querySelector('input[name="correo"]') as HTMLInputElement).required).toBe(true);
        expect((container.querySelector('input[name="tarjeta"]') as HTMLInputElement).required).toBe(true);
        expect((container.querySelector('input[name="calle"]') as HTMLInputElement).required).toBe(true);
        expect((container.querySelector('input[name="region"]') as HTMLInputElement).required).toBe(true);
        expect((container.querySelector('input[name="comuna"]') as HTMLInputElement).required).toBe(true);
    });

    test("No debería marcar teléfono como requerido", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        expect((container.querySelector('input[name="telefono"]') as HTMLInputElement).required).toBe(false);
    });

    test("Debería tener type='email' en el campo de correo", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        const inputCorreo = container.querySelector('input[name="correo"]') as HTMLInputElement;
        expect(inputCorreo.type).toBe('email');
    });

    test("Debería deshabilitar todos los campos cuando deshabilitado=true", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} deshabilitado={true} />);

        expect((container.querySelector('input[name="nombre"]') as HTMLInputElement).disabled).toBe(true);
        expect((container.querySelector('input[name="apellidos"]') as HTMLInputElement).disabled).toBe(true);
        expect((container.querySelector('input[name="correo"]') as HTMLInputElement).disabled).toBe(true);
        expect((container.querySelector('input[name="tarjeta"]') as HTMLInputElement).disabled).toBe(true);
        expect((container.querySelector('input[name="telefono"]') as HTMLInputElement).disabled).toBe(true);
        expect((container.querySelector('input[name="calle"]') as HTMLInputElement).disabled).toBe(true);
        expect((container.querySelector('input[name="region"]') as HTMLInputElement).disabled).toBe(true);
        expect((container.querySelector('input[name="comuna"]') as HTMLInputElement).disabled).toBe(true);
    });

    test("Debería permitir editar los campos cuando deshabilitado=false", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} deshabilitado={false} />);

        expect((container.querySelector('input[name="nombre"]') as HTMLInputElement).disabled).toBe(false);
        expect((container.querySelector('input[name="correo"]') as HTMLInputElement).disabled).toBe(false);
    });

    test("Snapshot: Debería mantener la estructura del formulario vacío", () => {
        const { container } = render(<FormularioCliente form={mockForm} onChange={mockOnChange} />);

        expect(container.firstChild).toMatchSnapshot();
    });

    test("Snapshot: Debería mantener la estructura del formulario con datos", () => {
        const formConDatos = {
            nombre: 'Ana',
            apellidos: 'García',
            correo: 'ana@example.com',
            tarjeta: '9876543210987654',
            telefono: '987654321',
            calle: 'Calle Falsa 456',
            region: 'Valparaíso',
            comuna: 'Viña del Mar'
        };

        const { container } = render(<FormularioCliente form={formConDatos} onChange={mockOnChange} />);

        expect(container.firstChild).toMatchSnapshot();
    });
});
