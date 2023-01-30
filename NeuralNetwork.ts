import p5 from "p5";

export default class NeuralNetwork {
    levels: Level[];
    constructor(neuronCounts: number[]) {
        // this.levels = new Array(neuronCounts.length).fill(0).map((_, i) => new Level(neuronCounts[i], neuronCounts[i + 1]));
        this.levels = [];

        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
        // console.log(this.levels);

    }

    static feedForward(givenInputs: any[], network: NeuralNetwork) {

        let outputs = Level.feedForward(givenInputs, network.levels[0]);

        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }

        return outputs;
    }

    static mutate(network: NeuralNetwork, amount = 1,) {
        network.levels.forEach(level => {
            level.biases = level.biases.map(bias => lerp(bias, Math.random() * 2 - 1, amount));

            level.weights.map(weightI => weightI.map(weightJ => lerp(weightJ, Math.random() * 2 - 1, amount)));
        });
    }
}

class Level {
    inputCount: number;
    outputCount: number;
    inputs: any[];
    outputs: any[];
    biases: any[];
    weights: any[][];

    constructor(inputCount: number, outputCount: number) {
        this.inputCount = inputCount;
        this.outputCount = outputCount;

        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level: Level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        // level.weights.map(con => con.map(weight => Math.random() * 2 - 1));

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs: any[], level: Level) {

        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {

                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}

function lerp(start: number, stop: number, amt: number) {
    return amt * (stop - start) + start;
};