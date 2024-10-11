# Model

In the MVC (Model-View-Controller) architecture, the Model is responsible for managing the data and business logic of the application. It interacts with the database to handle data retrieval, storage, and updates, forming the backbone of your application.

## Create a Model

To create a new model in Refiber, you can manually define it in the `app/models` directory.

```
├─ app/
│   └─ models/
│      └─ user.go // [!code ++]
```

For instance, in your user.go file, you might define a User model like this:

```go
package models

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
```

This User struct represents a basic model, where each field maps to a piece of user data. You can extend this by adding more fields or methods to implement business logic related to the User entity.
