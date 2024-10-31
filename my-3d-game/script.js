const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let selectedPiece = null;
const pieces = [];
const boardSize = 8;
const tileSize = 1;

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Create chessboard
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const tile = BABYLON.MeshBuilder.CreateBox(`tile${row}_${col}`, { size: tileSize }, scene);
            tile.position = new BABYLON.Vector3(col - boardSize / 2 + 0.5, 0, row - boardSize / 2 + 0.5);
            tile.material = new BABYLON.StandardMaterial(`tileMat${row}_${col}`, scene);
            tile.material.diffuseColor = (row + col) % 2 === 0 ? new BABYLON.Color3(1, 1, 1) : new BABYLON.Color3(0, 0, 0);
        }
    }

    // Create pieces
    createPieces(scene);

    return scene;
};

const createPieces = (scene) => {
    const pieceColors = {
        white: new BABYLON.Color3(1, 1, 1),
        black: new BABYLON.Color3(0, 0, 0)
    };

    // Define initial piece positions
    const initialPositions = {
        white: [
            { type: "rook", position: new BABYLON.Vector3(-3.5, 0.5, 3.5) },
            { type: "knight", position: new BABYLON.Vector3(-2.5, 0.5, 3.5) },
            { type: "bishop", position: new BABYLON.Vector3(-1.5, 0.5, 3.5) },
            { type: "queen", position: new BABYLON.Vector3(-0.5, 0.5, 3.5) },
            { type: "king", position: new BABYLON.Vector3(0.5, 0.5, 3.5) },
            { type: "bishop", position: new BABYLON.Vector3(1.5, 0.5, 3.5) },
            { type: "knight", position: new BABYLON.Vector3(2.5, 0.5, 3.5) },
            { type: "rook", position: new BABYLON.Vector3(3.5, 0.5, 3.5) },
        ],
        black: [
            { type: "rook", position: new BABYLON.Vector3(-3.5, 0.5, -3.5) },
            { type: "knight", position: new BABYLON.Vector3(-2.5, 0.5, -3.5) },
            { type: "bishop", position: new BABYLON.Vector3(-1.5, 0.5, -3.5) },
            { type: "queen", position: new BABYLON.Vector3(-0.5, 0.5, -3.5) },
            { type: "king", position: new BABYLON.Vector3(0.5, 0.5, -3.5) },
            { type: "bishop", position: new BABYLON.Vector3(1.5, 0.5, -3.5) },
            { type: "knight", position: new BABYLON.Vector3(2.5, 0.5, -3.5) },
            { type: "rook", position: new BABYLON.Vector3(3.5, 0.5, -3.5) },
        ]
    };

    // Create pieces
    for (const color in initialPositions) {
        initialPositions[color].forEach(piece => {
            createPiece(piece.type, piece.position, pieceColors[color], scene);
        });
        for (let i = 0; i < boardSize; i++) {
            createPiece("pawn", new BABYLON.Vector3(i - 3.5, 0.5, color === 'white' ? 1.5 : -1.5), pieceColors[color], scene);
        }
    }
};

const createPiece = (type, position, color, scene) => {
    const piece = BABYLON.MeshBuilder.CreateCylinder(type, { diameter: 0.5, height: 1 }, scene);
    piece.position = position;
    const material = new BABYLON.StandardMaterial(`${type}Mat`, scene);
    material.diffuseColor = color;
    piece.material = material;

    piece.actionManager = new BABYLON.ActionManager(scene);
    piece.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        handlePieceSelection(piece);
    }));

    pieces.push(piece);
};

const handlePieceSelection = (piece) => {
    if (selectedPiece) {
        const targetTile = getTargetTile(piece.position);
        if (targetTile && isValidMove(selectedPiece, targetTile)) {
            piece.position = targetTile.position.add(new BABYLON.Vector3(0, 0.5, 0)); // Adjust height
            selectedPiece = null; // Deselect piece
        }
    } else {
        selectedPiece = piece; // Select the piece
    }
};

const getTargetTile = (piecePosition) => {
    const col = Math.round(piecePosition.x + 3.5);
    const row = Math.round(piecePosition.z + 3.5);
    return scene.getMeshByName(`tile${row}_${col}`);
};

const isValidMove = (piece, targetTile) => {
    // Basic pawn movement validation
    const pieceName = piece.name;
    const targetPosition = targetTile.position;

    if (pieceName.startsWith('pawn')) {
        const direction = piece.position.z > 0 ? 1 : -1; // Direction based on color
        return targetPosition.z === piece.position.z + direction && targetPosition.x === piece.position.x;
    }
    return false; // Simplified for now
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
