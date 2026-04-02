package utils

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"heart-predict-backend/models"
)

// RunInference serializes the request to JSON, calls predict.py
// via subprocess, and parses stdout as PredictResponse.
func RunInference(req *models.PredictRequest) (*models.PredictResponse, error) {
	inputJSON, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("marshal input: %w", err)
	}

	pythonPath := os.Getenv("PYTHON_PATH")
	if pythonPath == "" {
		pythonPath = "python"
	}

	mlDir := os.Getenv("ML_DIR")
	if mlDir == "" {
		mlDir = "./ml"
	}

    mlDirAbs, _ := filepath.Abs(mlDir)
	scriptPath := filepath.Join(mlDirAbs, "predict.py")

	// Run: python predict.py '<json>'
	// We use the absolute path for the script and set the working directory to mlDirAbs
	cmd := exec.Command(pythonPath, scriptPath, string(inputJSON))
	cmd.Dir = mlDirAbs

	out, err := cmd.Output()
	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			return nil, fmt.Errorf("predict.py exited %d: %s", exitErr.ExitCode(), string(exitErr.Stderr))
		}
		return nil, fmt.Errorf("exec predict.py: %w", err)
	}

	var resp models.PredictResponse
	if err := json.Unmarshal(out, &resp); err != nil {
		return nil, fmt.Errorf("parse inference output: %w, raw: %s", err, string(out))
	}

	return &resp, nil
}
