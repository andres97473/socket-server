export class GraficaData2 {
  private preguntas: string[] = [
    "Pregunta 1",
    "Pregunta 2",
    "Pregunta 3",
    "Pregunta 4",
  ];
  private valores = [0, 0, 0, 0];

  constructor() {}

  getDataGrafica() {
    return {
      labels: this.preguntas,
      datasets: [{ data: this.valores, label: "Preguntas" }],
    };
  }

  incrementarValor(posicion: number, valor: number) {
    this.valores[posicion] += valor;
    return this.getDataGrafica();
  }
}
