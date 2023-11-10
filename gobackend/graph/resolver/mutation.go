// /gobackend/graph/resolver/mutation.go

package graph

import (
	"encoding/json"
	"github.com/doctor-ew/graph-spa-bun/gobackend/graph/model"
	"io/ioutil"
	"net/http"
	"strings"
)

/*
type mutationResolver struct{ *Resolver }
*/
/*

func (r *Resolver) Mutation() MutationResolver {
	return &mutationResolver{r}
}
*/

/* * /
// CreateRickAndMortyAssociation is the resolver for the createRickAndMortyAssociation field.
func (r *mutationResolver) CreateRickAndMortyAssociation(ctx context.Context, rickID string, mortyID string) (*model.RickAndMortyAssociation, error) {
	ricks, err := r.charactersByName("Rick")
	if err != nil {
		return nil, err
	}

	morties, err := r.charactersByName("Morty")
	if err != nil {
		return nil, err
	}

	for _, rick := range ricks {
		for _, morty := range morties {
			if shouldAssociate(rick, morty) {
				return &model.RickAndMortyAssociation{
					Rick:    rick,
					Morties: []*model.Character{morty},
				}, nil
			}
		}
	}

	return nil, fmt.Errorf("no association found")
}

/* */
func (r *mutationResolver) charactersByName(name string) ([]*model.Character, error) {
	query := `
	{
		characters(filter: {name: "` + name + `"}) {
			results {
				id
				name
				status
				species
				type
				gender
				image
				origin {
					id
					name
				}
				location {
					id
					name
				}
			}
		}
	}`

	body, err := makeHTTPRequest("https://rickandmortyapi.com/graphql", query)
	if err != nil {
		return nil, err
	}

	var response struct {
		Data struct {
			Characters struct {
				Results []*model.Character `json:"results"`
			} `json:"characters"`
		} `json:"data"`
	}

	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, err
	}

	return response.Data.Characters.Results, nil
}

// makeHTTPRequest handles the HTTP request to the Rick and Morty API
func makeHTTPRequest(url string, query string) ([]byte, error) {
	req, err := http.NewRequest("POST", url, strings.NewReader(query))
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

// Other resolver implementations...
