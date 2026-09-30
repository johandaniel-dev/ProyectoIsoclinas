// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const ecuacion = document.getElementById("ecuacion");

const puntoX = document.getElementById("puntoX");
const puntoY = document.getElementById("puntoY");

const rangoXMin = document.getElementById("rangoXMin");
const rangoXMax = document.getElementById("rangoXMax");

const rangoYMin = document.getElementById("rangoYMin");
const rangoYMax = document.getElementById("rangoYMax");

const cantidadPuntos =
    document.getElementById("cantidadPuntos");

const resultado =
    document.getElementById("resultado");

const matriz =
    document.getElementById("matriz");

const matrizSimple =
    document.getElementById("matrizSimple");

// ==========================================
// PREPARAR Y NORMALIZAR ECUACIÓN
// ==========================================

function prepararEcuacion(ecuacion) {

    let expresion = ecuacion.trim();

    // ==========================================
    // FUNCIONES TRIGONOMÉTRICAS
    // ==========================================

    expresion = expresion.replace(/\bsen(o)?\b/gi, "sin");
    expresion = expresion.replace(/\bcoseno\b/gi, "cos");
    expresion = expresion.replace(/\btg\b/gi, "tan");
    expresion = expresion.replace(/\btangente\b/gi, "tan");


    // ==========================================
    // RAÍCES
    // ==========================================

    expresion = expresion.replace(/\braiz\b/gi, "sqrt");
    expresion = expresion.replace(/√/g, "sqrt");


    // ==========================================
    // LOGARITMOS
    // ==========================================

    expresion = expresion.replace(/\bln\b/gi, "log");


    // ==========================================
    // VALOR ABSOLUTO
    // ==========================================

    expresion = expresion.replace(/\babs\b/gi, "abs");


    // ==========================================
    // SÍMBOLOS MATEMÁTICOS
    // ==========================================

    // Multiplicación con ×
    expresion = expresion.replace(/×/g, "*");

    // División con ÷
    expresion = expresion.replace(/÷/g, "/");

    // Pi
    expresion = expresion.replace(/π/g, "pi");


    // ==========================================
    // ELIMINAR ESPACIOS INNECESARIOS
    // ==========================================

    expresion = expresion.replace(/\s+/g, " ");

    return expresion;
}

// ==========================================
// CREAR RANGO
// ==========================================

function crearRango(min, max, cantidad) {

    const valores = [];

    const paso =
        (max - min) / (cantidad - 1);

    for (let i = 0; i < cantidad; i++) {

        valores.push(
            Number((min + i * paso).toFixed(6))
        );

    }

    return valores;
}


// ==========================================
// OBTENER VALOR NUMÉRICO
// ==========================================

function obtenerNumero(elemento) {

    return Number(elemento.value);

}

// ==========================================
// CALCULAR CURVA SOLUCIÓN CON RK4
// ==========================================

function calcularSolucion(expresion, x0, y0, xMin, xMax, yMin, yMax) {

    const xSolucion = [];
    const ySolucion = [];

    // Tamaño del paso
    const paso = Math.min(0.02, (xMax - xMin) / 200);

    // ------------------------------------------
    // PARTE HACIA LA DERECHA
    // ------------------------------------------

    let x = x0;
    let y = y0;

    const xDerecha = [];
    const yDerecha = [];

    xDerecha.push(x);
    yDerecha.push(y);

    while (x < xMax) {

        const h = Math.min(paso, xMax - x);

        try {

            const k1 = expresion.evaluate({
                x: x,
                y: y
            });

            const k2 = expresion.evaluate({
                x: x + h / 2,
                y: y + h * k1 / 2
            });

            const k3 = expresion.evaluate({
                x: x + h / 2,
                y: y + h * k2 / 2
            });

            const k4 = expresion.evaluate({
                x: x + h,
                y: y + h * k3
            });

            y = y + (h / 6) * (
                k1 +
                2 * k2 +
                2 * k3 +
                k4
            );

            x = x + h;

            if (
                !Number.isFinite(y) ||
                y < yMin ||
                y > yMax
            ) {
                break;
            }

            xDerecha.push(x);
            yDerecha.push(y);

        } catch {

            break;

        }
    }


    // ------------------------------------------
    // PARTE HACIA LA IZQUIERDA
    // ------------------------------------------

    x = x0;
    y = y0;

    const xIzquierda = [];
    const yIzquierda = [];

    xIzquierda.push(x);
    yIzquierda.push(y);

    while (x > xMin) {

        const h = -Math.min(paso, x - xMin);

        try {

            const k1 = expresion.evaluate({
                x: x,
                y: y
            });

            const k2 = expresion.evaluate({
                x: x + h / 2,
                y: y + h * k1 / 2
            });

            const k3 = expresion.evaluate({
                x: x + h / 2,
                y: y + h * k2 / 2
            });

            const k4 = expresion.evaluate({
                x: x + h,
                y: y + h * k3
            });

            y = y + (h / 6) * (
                k1 +
                2 * k2 +
                2 * k3 +
                k4
            );

            x = x + h;

            if (
                !Number.isFinite(y) ||
                y < yMin ||
                y > yMax
            ) {
                break;
            }

            xIzquierda.push(x);
            yIzquierda.push(y);

        } catch {

            break;

        }
    }


    // ------------------------------------------
    // UNIR LAS DOS DIRECCIONES
    // ------------------------------------------

    xSolucion.push(...xIzquierda.reverse());

    ySolucion.push(...yIzquierda.reverse());

    xSolucion.push(...xDerecha.slice(1));

    ySolucion.push(...yDerecha.slice(1));


    return {
        x: xSolucion,
        y: ySolucion
    };
}

// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

function graficar() {

    const ecuacionOriginal =
    ecuacion.value.trim();

    const ecuacionIngresada =
    prepararEcuacion(ecuacionOriginal);

    const x = obtenerNumero(puntoX);
    const y = obtenerNumero(puntoY);

    const xMin = obtenerNumero(rangoXMin);
    const xMax = obtenerNumero(rangoXMax);

    const yMin = obtenerNumero(rangoYMin);
    const yMax = obtenerNumero(rangoYMax);

    const cantidad =
        obtenerNumero(cantidadPuntos);


    // ======================================
    // VALIDACIONES
    // ======================================

    if (ecuacionIngresada === "") {

        resultado.textContent =
            "Escribe una ecuación.";

        return;
    }


    if (
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {

        resultado.textContent =
            "El punto no es válido.";

        return;
    }


    if (
        !Number.isFinite(xMin) ||
        !Number.isFinite(xMax) ||
        !Number.isFinite(yMin) ||
        !Number.isFinite(yMax)
    ) {

        return;
    }


    if (xMin >= xMax || yMin >= yMax) {

        resultado.textContent =
            "Revisa los rangos.";

        return;
    }


    if (
        x < xMin ||
        x > xMax ||
        y < yMin ||
        y > yMax
    ) {

        resultado.textContent =
            "El punto está fuera del gráfico.";

        return;
    }


    if (
        !Number.isInteger(cantidad) ||
        cantidad < 5 ||
        cantidad > 50
    ) {

        resultado.textContent =
            "La resolución debe estar entre 5 y 50.";

        return;
    }


    try {

        // ======================================
        // INTERPRETAR ECUACIÓN
        // ======================================

        const expresion =
            math.compile(ecuacionIngresada);


        // ======================================
        // PENDIENTE DEL PUNTO
        // ======================================

        const pendiente =
            expresion.evaluate({
                x: x,
                y: y
            });

            // ==========================================
// CURVA SOLUCIÓN
// ==========================================

const solucion = calcularSolucion(
    expresion,
    x,
    y,
    xMin,
    xMax,
    yMin,
    yMax
);


        if (!Number.isFinite(pendiente)) {

            resultado.textContent =
                "La pendiente no es válida en ese punto.";

            return;
        }


        // ======================================
        // MOSTRAR INFORMACIÓN
        // ======================================

resultado.innerHTML = `

    <div>
        <span>Ecuación diferencial</span><br>
        <strong>dy/dx = ${ecuacionIngresada}</strong>
    </div>

    <div style="margin-top: 10px;">
        <span>Punto seleccionado</span><br>
        <strong>(${x}, ${y})</strong>
    </div>

    <div style="margin-top: 10px;">
        <span>Pendiente en el punto</span><br>
        <strong>m = ${Number(pendiente).toFixed(4)}</strong>
    </div>

`;


        // ======================================
        // CREAR EJES
        // ======================================

        const valoresX =
            crearRango(
                xMin,
                xMax,
                cantidad
            );

        const valoresY =
            crearRango(
                yMin,
                yMax,
                cantidad
            );


        // ======================================
        // CREAR MATRIZ
        // ======================================

        let tabla = "<table>";

        tabla += "<tr>";

        tabla += "<th>Y \\ X</th>";


        valoresX.forEach(function (valorX) {

            tabla +=
                `<th>${valorX}</th>`;

        });


        tabla += "</tr>";


        valoresY.forEach(function (valorY) {

            tabla += "<tr>";

            tabla +=
                `<th>${valorY}</th>`;


valoresX.forEach(function (valorX) {

    try {

        const valor =
            expresion.evaluate({

                x: valorX,

                y: valorY

            });


        if (Number.isFinite(valor)) {

            // Comprobar si esta celda corresponde
            // exactamente al punto seleccionado

            const esPuntoX =
                Math.abs(valorX - x) < 0.000001;

            const esPuntoY =
                Math.abs(valorY - y) < 0.000001;


            if (esPuntoX && esPuntoY) {

                tabla += `
                    <td class="celda-punto">
                        ${Number(valor).toFixed(2)}
                    </td>
                `;

            } else {

                tabla +=
                    `<td>${Number(valor).toFixed(2)}</td>`;

            }

        } else {

            tabla += "<td>—</td>";

        }

    } catch {

        tabla += "<td>—</td>";

    }

});


            tabla += "</tr>";

        });


        tabla += "</table>";

        matriz.innerHTML = tabla;

        // ==========================================
// MATRIZ SIMPLIFICADA
// ==========================================

const valoresSimplesX = [-2, -1, 0, 1, 2];
const valoresSimplesY = [2, 1, 0, -1, -2];

let tablaSimple = "<table>";


// Encabezado
tablaSimple += "<tr>";

tablaSimple += "<th>Y \\ X</th>";


valoresSimplesX.forEach(function (valorX) {

    tablaSimple += `<th>${valorX}</th>`;

});


tablaSimple += "</tr>";


// Crear las filas
valoresSimplesY.forEach(function (valorY) {

    tablaSimple += "<tr>";

    tablaSimple += `<th>${valorY}</th>`;


    valoresSimplesX.forEach(function (valorX) {

        try {

            const valor =
                expresion.evaluate({
                    x: valorX,
                    y: valorY
                });


            if (Number.isFinite(valor)) {

                tablaSimple += `
                    <td>
                        ${Number(valor).toFixed(2)}
                    </td>
                `;

            } else {

                tablaSimple += "<td>—</td>";

            }

        } catch {

            tablaSimple += "<td>—</td>";

        }

    });


    tablaSimple += "</tr>";

});


tablaSimple += "</table>";

matrizSimple.innerHTML = tablaSimple;


        // ======================================
        // MATRIZ PARA LAS ISOCLINAS
        // ======================================

        const zGrafico = [];


        valoresY.forEach(function (valorY) {

            const fila = [];


            valoresX.forEach(function (valorX) {

                try {

                    const valor =
                        expresion.evaluate({

                            x: valorX,

                            y: valorY

                        });


                    if (Number.isFinite(valor)) {

                        fila.push(valor);

                    } else {

                        fila.push(null);

                    }

                } catch {

                    fila.push(null);

                }

            });


            zGrafico.push(fila);

        });


        // ======================================
        // CAMPO DE DIRECCIONES
        // ======================================

        const lineasX = [];
        const lineasY = [];


        valoresY.forEach(function (valorY) {

            valoresX.forEach(function (valorX) {

                let pendienteLocal;


                try {

                    pendienteLocal =
                        expresion.evaluate({

                            x: valorX,

                            y: valorY

                        });

                } catch {

                    return;

                }


                if (!Number.isFinite(pendienteLocal)) {

                    return;

                }


                // Evitar líneas exageradamente inclinadas

                if (pendienteLocal > 20) {

                    pendienteLocal = 20;

                }


                if (pendienteLocal < -20) {

                    pendienteLocal = -20;

                }


                // Vector de pendiente

                let vectorX = 1;

                let vectorY = pendienteLocal;


                const magnitud =
                    Math.sqrt(
                        vectorX * vectorX +
                        vectorY * vectorY
                    );


                vectorX /= magnitud;

                vectorY /= magnitud;


                // Longitud

                const longitud = 0.25;


                const dx =
                    vectorX * longitud;

                const dy =
                    vectorY * longitud;


                // Segmento

                lineasX.push(
                    valorX - dx,
                    valorX + dx,
                    null
                );


                lineasY.push(
                    valorY - dy,
                    valorY + dy,
                    null
                );

            });

        });


        // ======================================
        // DATOS DEL GRÁFICO
        // ======================================

        const datosGrafico = [

            // -------------------------------
            // ISOCLINAS
            // -------------------------------

            {

                x: valoresX,

                y: valoresY,

                z: zGrafico,

                type: "contour",

                contours: {

                    coloring: "lines",

                    showlabels: true,

                    ncontours: 15

                },

                line: {

                    width: 1

                },

                showscale: false,

                name: "Isoclinas"

            },


            // -------------------------------
            // CAMPO DE DIRECCIONES
            // -------------------------------

            {

                x: lineasX,

                y: lineasY,

                type: "scatter",

                mode: "lines",

                line: {

                    width: 1

                },

                name: "Campo de direcciones"

            },


            // -------------------------------
            // PUNTO
            // -------------------------------

            {

                x: [x],

                y: [y],

                type: "scatter",

                mode: "markers",

                marker: {

                    size: 14

                },

                name: "Punto seleccionado"

            },

            // --------------------------------------
// CURVA SOLUCIÓN
// --------------------------------------

{
    x: solucion.x,
    y: solucion.y,

    type: "scatter",
    mode: "lines",

    line: {
        width: 4,
        dash: "solid"
    },

    name: "Curva solución"
},

        ];


        // ======================================
        // CONFIGURACIÓN
        // ======================================

        const configuracion = {

            title:
                `dy/dx = ${ecuacionIngresada}`,

            xaxis: {

                title: "x",

                range: [
                    xMin,
                    xMax
                ],

                zeroline: true

            },

            yaxis: {

                title: "y",

                range: [
                    yMin,
                    yMax
                ],

                zeroline: true

            },

            hovermode: "closest",

            showlegend: true,

            margin: {

                l: 60,

                r: 30,

                t: 70,

                b: 60

            }

        };


        // ======================================
        // DIBUJAR
        // ======================================

        Plotly.react(

            "grafico",

            datosGrafico,

            configuracion,

            {

                responsive: true

            }

        );

    } catch (error) {

        console.error(error);

        resultado.textContent =
            "La ecuación todavía no es válida.";

    }

}


// ==========================================
// ACTUALIZACIÓN AUTOMÁTICA
// ==========================================

const campos = [

    ecuacion,

    puntoX,

    puntoY,

    rangoXMin,

    rangoXMax,

    rangoYMin,

    rangoYMax,

    cantidadPuntos

];


campos.forEach(function (campo) {

    campo.addEventListener(
        "input",
        graficar
    );

});


// ==========================================
// GRAFICAR AL ABRIR LA PÁGINA
// ==========================================

graficar();