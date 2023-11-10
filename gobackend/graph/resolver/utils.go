package graph

import (
	"github.com/doctor-ew/graph-spa-bun/gobackend/graph/model"
	"strings"
)

// shouldAssociate determines if a Rick and Morty should be associated
func shouldAssociate(rick *model.Character, morty *model.Character) bool {
	if rick.Origin != nil && morty.Origin != nil {
		if rick.Origin.ID != nil && morty.Origin.ID != nil && *rick.Origin.ID == *morty.Origin.ID {
			return true
		}

		if rick.Origin.Name != nil && morty.Origin.Name != nil && *rick.Origin.Name == "unknown" && *morty.Origin.Name == "unknown" {
			rickNamePattern := strings.TrimSpace(strings.Replace(rick.Name, "Rick", "", -1))
			mortyNamePattern := strings.TrimSpace(strings.Replace(morty.Name, "Morty", "", -1))
			if rickNamePattern == mortyNamePattern {
				return true
			}
		}
	}

	if rick.Location != nil && morty.Location != nil && rick.Location.ID != nil && morty.Location.ID != nil && *rick.Location.ID == *morty.Location.ID && *rick.Location.ID != "3" {
		return true
	}

	return false
}
