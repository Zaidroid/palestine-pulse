package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/xuri/excelize/v2"
)

func main() {
	dir := "src/data"

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return
	}

	for _, file := range files {
		ext := filepath.Ext(file.Name())
		if ext == ".xlsx" || ext == ".xls" {
			filePath := filepath.Join(dir, file.Name())
			jsonPath := strings.TrimSuffix(filePath, ext) + ".json"

			f, err := excelize.OpenFile(filePath)
			if err != nil {
				fmt.Println("Error opening file:", err)
				continue
			}

			sheetName := f.GetSheetName(0)
			rows, err := f.GetRows(sheetName)
			if err != nil {
				fmt.Println("Error getting rows:", err)
				continue
			}

			if len(rows) == 0 {
				fmt.Println("No rows found in", file.Name())
				continue
			}

			headers := rows[0]
			data := make([]map[string]interface{}, 0)

			for _, row := range rows[1:] {
				rowData := make(map[string]interface{})
				for i, cell := range row {
					if i < len(headers) {
						rowData[headers[i]] = cell
					}
				}
				data = append(data, rowData)
			}

			jsonData, err := json.MarshalIndent(data, "", "  ")
			if err != nil {
				fmt.Println("Error marshalling to JSON:", err)
				continue
			}

			err = ioutil.WriteFile(jsonPath, jsonData, 0644)
			if err != nil {
				fmt.Println("Error writing JSON file:", err)
				continue
			}

			fmt.Println("Converted", file.Name(), "to", filepath.Base(jsonPath))
		}
	}
}


import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/xuri/excelize/v2"
)

func main() {
	dir := "src/data"

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return
	}

	for _, file := range files {
		ext := filepath.Ext(file.Name())
		if ext == ".xlsx" || ext == ".xls" {
			filePath := filepath.Join(dir, file.Name())
			jsonPath := strings.TrimSuffix(filePath, ext) + ".json"

			f, err := excelize.OpenFile(filePath)
			if err != nil {
				fmt.Println("Error opening file:", err)
				continue
			}

			sheetName := f.GetSheetName(0)
			rows, err := f.GetRows(sheetName)
			if err != nil {
				fmt.Println("Error getting rows:", err)
				continue
			}

			if len(rows) == 0 {
				fmt.Println("No rows found in", file.Name())
				continue
			}

			headers := rows[0]
			data := make([]map[string]interface{}, 0)

			for _, row := range rows[1:] {
				rowData := make(map[string]interface{})
				for i, cell := range row {
					if i < len(headers) {
						rowData[headers[i]] = cell
					}
				}
				data = append(data, rowData)
			}

			jsonData, err := json.MarshalIndent(data, "", "  ")
			if err != nil {
				fmt.Println("Error marshalling to JSON:", err)
				continue
			}

			err = ioutil.WriteFile(jsonPath, jsonData, 0644)
			if err != nil {
				fmt.Println("Error writing JSON file:", err)
				continue
			}

			fmt.Println("Converted", file.Name(), "to", filepath.Base(jsonPath))
		}
	}
}


import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/xuri/excelize/v2"
)

func main() {
	dir := "src/data"

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return
	}

	for _, file := range files {
		ext := filepath.Ext(file.Name())
		if ext == ".xlsx" || ext == ".xls" {
			filePath := filepath.Join(dir, file.Name())
			jsonPath := strings.TrimSuffix(filePath, ext) + ".json"

			f, err := excelize.OpenFile(filePath)
			if err != nil {
				fmt.Println("Error opening file:", err)
				continue
			}

			sheetName := f.GetSheetName(0)
			rows, err := f.GetRows(sheetName)
			if err != nil {
				fmt.Println("Error getting rows:", err)
				continue
			}

			if len(rows) == 0 {
				fmt.Println("No rows found in", file.Name())
				continue
			}

			headers := rows[0]
			data := make([]map[string]interface{}, 0)

			for _, row := range rows[1:] {
				rowData := make(map[string]interface{})
				for i, cell := range row {
					if i < len(headers) {
						rowData[headers[i]] = cell
					}
				}
				data = append(data, rowData)
			}

			jsonData, err := json.MarshalIndent(data, "", "  ")
			if err != nil {
				fmt.Println("Error marshalling to JSON:", err)
				continue
			}

			err = ioutil.WriteFile(jsonPath, jsonData, 0644)
			if err != nil {
				fmt.Println("Error writing JSON file:", err)
				continue
			}

			fmt.Println("Converted", file.Name(), "to", filepath.Base(jsonPath))
		}
	}
}


import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/xuri/excelize/v2"
)

func main() {
	dir := "src/data"

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return
	}

	for _, file := range files {
		ext := filepath.Ext(file.Name())
		if ext == ".xlsx" || ext == ".xls" {
			filePath := filepath.Join(dir, file.Name())
			jsonPath := strings.TrimSuffix(filePath, ext) + ".json"

			f, err := excelize.OpenFile(filePath)
			if err != nil {
				fmt.Println("Error opening file:", err)
				continue
			}

			sheetName := f.GetSheetName(0)
			rows, err := f.GetRows(sheetName)
			if err != nil {
				fmt.Println("Error getting rows:", err)
				continue
			}

			if len(rows) == 0 {
				fmt.Println("No rows found in", file.Name())
				continue
			}

			headers := rows[0]
			data := make([]map[string]interface{}, 0)

			for _, row := range rows[1:] {
				rowData := make(map[string]interface{})
				for i, cell := range row {
					if i < len(headers) {
						rowData[headers[i]] = cell
					}
				}
				data = append(data, rowData)
			}

			jsonData, err := json.MarshalIndent(data, "", "  ")
			if err != nil {
				fmt.Println("Error marshalling to JSON:", err)
				continue
			}

			err = ioutil.WriteFile(jsonPath, jsonData, 0644)
			if err != nil {
				fmt.Println("Error writing JSON file:", err)
				continue
			}

			fmt.Println("Converted", file.Name(), "to", filepath.Base(jsonPath))
		}
	}
}
