import type { Producto } from "../components/Producto";

export const productos: Producto[] = [
    {
        id: "JM001",
        titulo: "Catan",
        precio: 29990,
        descripcion:
            "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.",
        categoria: "Juegos de Mesa",
        imagen: "/img/catan.png",
        oferta: true,
        descuento: 10,
    },
    {
        id: "JM002",
        titulo: "Carcassonne",
        precio: 24990,
        descripcion:
            "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.",
        categoria: "Juegos de Mesa",
        imagen: "/img/carcassonne.png",
        oferta: true,
        descuento: 15,
    },
    {
        id: "AC001",
        titulo: "Controlador Inalámbrico Xbox Series X",
        precio: 59990,
        descripcion:
            "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.",
        categoria: "Accesorios",
        imagen: "/img/xbox_controller.png",
        oferta: true,
        descuento: 20,
    },
    {
        id: "AC002",
        titulo: "Auriculares Gamer HyperX Cloud II",
        precio: 79990,
        descripcion:
            "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.",
        categoria: "Accesorios",
        imagen: "/img/hyperx_cloud.png",
        oferta: true,
        descuento: 30,
    },
    {
        id: "CO001",
        titulo: "PlayStation 5",
        precio: 549990,
        descripcion:
            "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.",
        categoria: "Consolas",
        imagen: "/img/ps5-test.png",
        oferta: false,
    },
    {
        id: "CG001",
        titulo: "PC Gamer ASUS ROG Strix",
        precio: 1299990,
        descripcion:
            "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.",
        categoria: "Computadores Gamers",
        imagen: "/img/pc gamer.png",
        oferta: false,
    },
    {
        id: "SG001",
        titulo: "Silla Gamer Secretlab Titan",
        precio: 349990,
        descripcion:
            "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.",
        categoria: "Sillas Gamers",
        imagen: "/img/silla_gamer.png",
        oferta: false,
    },
    {
        id: "MS001",
        titulo: "Mouse Gamer Logitech G502 HERO",
        precio: 49990,
        descripcion:
            "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.",
        categoria: "Mouse",
        imagen: "/img/mouse.png",
        oferta: false,
    },
    {
        id: "MP001",
        titulo: "Mousepad Razer Goliathus Extended Chroma",
        precio: 29990,
        descripcion:
            "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.",
        categoria: "Mousepad",
        imagen: "/img/mousepad.png",
        oferta: false,
    },
    {
        id: "PP001",
        titulo: "Polera Gamer Personalizada 'Level-Up'",
        precio: 14990,
        descripcion:
            "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
        categoria: "Poleras Personalizadas",
        imagen: "/img/polera_gamer_life.png",
        oferta: false,
    },
];
