# Routing

[[toc]]

## Basic Routing

Refiber offers a simple and intuitive way to define web routes. You can find an example in the `routes/web.go` file:

```go
// routes/web.go

package routes

import (...)

func RegisterWeb(route router.RouterInterface, app *app.App) {
	m := middleware.Setup(app)
	controller := web.Setup(app)

	route.Get("/", controller.Index)
	route.Get("/about", controller.About)

	profile := route.Group("/profile", m.AuthWeb)
	profile.Get("/", controller.Profile)

	route.Get("/login", controller.Login, m.Guest)
	route.Post("/login", controller.Auth)
	route.Post("/logout", controller.Logout)
}
```

### Route Parameters

To capture dynamic URL segments within your routes, use a colon `:` followed by the parameter name, like `:id`:

```go
controller := web.Setup(app)

route.Get("/users/:id", controller.User().Show)

```

Inside your controller, you can retrieve the value of the route parameter using `c.Params()`:

```go
func (ctr *userController) Show(s support.Refiber, c *fiber.Ctx) error {
    userID := c.Params("id") // [!code focus]
    ...
}

```

Since Refiber is built on top of GoFiber, you can leverage all the routing features GoFiber offers, including route parameters.

For more details on routing parameters, visit the [GoFiber Docs](https://docs.gofiber.io/guide/routing#parameters).

### Middleware

In Refiber, you can attach middleware to any route by passing it as the last parameter of the route method.

For example, here’s a simple route definition for `/dashboard`, which is handled by `controller.Index`:

```go
controller := web.Setup(app)

route.Get("/dashboard", controller.Index)
```

Now, suppose you have an `AuthWeb` middleware stored in the `m` variable. To apply this middleware to the `/dashboard` route, simply add it as the last parameter:

```go
m := middleware.Setup(app) // [!code ++]
controller := web.Setup(app)

route.Get("/dashboard", controller.Index) // [!code --]
route.Get("/dashboard", controller.Index, m.AuthWeb) // [!code ++]
```

You can also chain multiple middleware for a single route:

```go
m := middleware.Setup(app)
controller := web.Setup(app)

route.Get("/dashboard", controller.Index, m.AuthWeb)
route.Get("/dashboard/settings", controller.Index, m.AuthWeb, m.IsSuperAdmin) // [!code ++]

```

For more complex scenarios, you might want to use the `route.Group()` method to apply middleware more efficiently across multiple routes.

## Available Route Methods

```go
route.Get(PATH, CONTROLLER, ...MIDDLEWARES)
route.Head(PATH, CONTROLLER, ...MIDDLEWARES)
route.Post(PATH, CONTROLLER, ...MIDDLEWARES)
route.Put(PATH, CONTROLLER, ...MIDDLEWARES)
route.Patch(PATH, CONTROLLER, ...MIDDLEWARES)
route.Delete(PATH, CONTROLLER, ...MIDDLEWARES)

route.Group(PATH, ...MIDDLEWARES)
route.CRUD(PATH, CRUD_HANDLER, ...MIDDLEWARES)
```

### Get, Head, Post, Put, Patch, & Delete Methods

These methods are straightforward, taking three main parameters:

1. **PATH**: The URL path.
2. **CONTROLLER**: The controller responsible for handling the request.
3. **MIDDLEWARES** (optional): Any middleware to apply to the route.

Example:

```go
func RegisterWeb(route router.RouterInterface, app *app.App) {
	m := middleware.Setup(app)
	controller := web.Setup(app)

	route.Get("/", controller.Index)
	route.Get("/about", controller.About)

	profile := route.Group("/profile", m.AuthWeb)
	profile.Get("/", controller.Profile)

	route.Get("/login", controller.Login, m.Guest)
	route.Post("/login", controller.Auth)
	route.Post("/logout", controller.Logout)
}
```

### route.Group Method

The `route.Group()` method allows you to group several routes under a common path and apply shared middleware. This is useful when multiple routes require the same middleware or share a common prefix.

### route.CRUD Method

Refiber simplifies the creation of CRUD routes with the `route.CRUD()` method.
This automatically generates common CRUD routes based on a controller.

To generate CRUD routes, create the controller using the command `refiber-cli make:controller --crud` or `refiber-cli make:controller -c`. For more details, see [Basics/Controller](/v0.2/basics/controller).

Example:

```go
controller := web.Setup(app)

route.CRUD("/products", func(crud *router.Crud) {
	crud.Controller = controller.Product()
})

/**
 * The following routes are generated:
 *
 * [GET]    /products              -> Index()
 * [GET]    /products/create       -> Create()
 * [POST]   /products/create       -> Store()
 * [GET]    /products/:id          -> Show()
 * [GET]    /products/:id/edit     -> Edit()
 * [PUT]    /products/:id/edit     -> Update()
 * [DELETE] /products/:id/delete   -> Destroy()
 */
```

#### route.CRUD: Customizing Route Parameters

By default, the CRUD method uses id as the route parameter. You can change it to any identifier, such as slug:

```go
controller := web.Setup(app)

route.CRUD("/products", func(crud *router.Crud) {
	crud.Controller = controller.Product()
	crud.Identifier = "slug" // [!code focus]
})

/** // [!code focus]
 * The routes generated will use "slug" instead of "id": // [!code focus]
 * // [!code focus]
 * [GET]      /products // [!code focus]
 * ... // [!code focus]
 * [GET]      /products/:slug // [!code focus]
 * [PUT]      /products/:slug/edit // [!code focus]
 * [DELETE]   /products/:slug/destroy // [!code focus]
 */ // [!code focus]
```

#### route.CRUD: Limiting Routes (e.g., Edit & Update Only)

You can specify which routes to implement by using the Only field with specific RouteTypes:

```go
controller := web.Setup(app)

route.CRUD("/products", func(crud *router.Crud) {
	crud.Controller = controller.Product()
	crud.Only = &[]router.RouteType{ // [!code focus]
		router.RouteTypeEdit, // [!code focus]
		router.RouteTypeUpdate, // [!code focus]
	} // [!code focus]
})

/** // [!code focus]
 * This generates only the following routes: // [!code focus]
 * // [!code focus]
 * [GET]    /products/:id/edit   -> Edit() // [!code focus]
 * [PUT]    /products/:id/edit   -> Update() // [!code focus]
 */ // [!code focus]
```

Available `router.RouteType`

| Type             | Method | Path             | Controller |
| ---------------- | ------ | ---------------- | ---------- |
| RouteTypeIndex   | GET    | /path            | Index()    |
| RouteTypeCreate  | GET    | /path/create     | Create()   |
| RouteTypeStore   | POST   | /path            | Store()    |
| RouteTypeShow    | GET    | /path/:id        | Show()     |
| RouteTypeEdit    | GET    | /path/:id/edit   | Edit()     |
| RouteTypeUpdate  | PUT    | /path/:id/edit   | Update()   |
| RouteTypeDestroy | DELETE | /path/:id/delete | Destroy()  |

#### route.CRUD: Excluding Routes

If you want to omit specific routes, use the Except field:

```go
controller := web.Setup(app)

route.CRUD("/products", func(crud *router.Crud) {
	crud.Controller = controller.Product()

	crud.Except = &[]router.RouteType{ // [!code focus]
		router.RouteTypeEdit, // [!code focus]
		router.RouteTypeUpdate, // [!code focus]
	} // [!code focus]
})

/** // [!code focus]
 * All routes except Edit and Update will be generated: // [!code focus]
 * // [!code focus]
 * [GET]    /products              -> Index() // [!code focus]
 * [POST]   /products/create       -> Store() // [!code focus]
 * [GET]    /products/:id          -> Show() // [!code focus]
 * [DELETE] /products/:id/delete   -> Destroy() // [!code focus]
 */ // [!code focus]
```

#### route.CRUD: Applying Middleware to Specific Routes

Instead of adding middleware to all routes, you can target specific routes by using AddMiddlewareToRoutes:

```go
controller := web.Setup(app)

route.CRUD("/products", func(crud *router.Crud) {
	crud.Controller = controller.Product()

	crud.AddMidlewareToRoutes( // [!code focus]
		m.IsSuperAdmin, // The Middleware // [!code focus]
        router.RouteTypeUpdate, // Apply to Update route  // [!code focus]
		router.RouteTypeDestroy, // Apply to Destroy route // [!code focus]
	) // [!code focus]
}, m.Auth)
```

## Register new route

TODO

## API route

TODO
