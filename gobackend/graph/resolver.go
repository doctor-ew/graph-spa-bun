package graph

// This file will be automatically regenerated based on the schema, any proto dependencies will be copied.

import (
	"github.com/my/module/graph/generated"
)

type Resolver struct{}

func (r *Resolver) Mutation() generated.MutationResolver {
	return &mutationResolver{r}
}

func (r *Resolver) Query() generated.QueryResolver {
	return &queryResolver{r}
}

// Here you'd implement resolver methods like:
// func (r *queryResolver) CharactersByName(ctx context.Context, name string) ([]*model.Character, error) {
//     // Your logic here
// }

// and so on for each resolver method defined in your schema.

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
