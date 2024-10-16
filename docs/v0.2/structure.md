# Directory Structure

If you’re familiar with [Laravel](https://laravel.com), you may notice that Refiber’s directory structure is quite similar. The main reason for this is that I’ve worked extensively with Laravel in the past, and this structure has proven to be effective. However, I have also worked with other directory structures.

```
.
├─ main.go
│
├─ app/
│  ├─ app.go
│  ├─ controllers/
│  ├─ middleware/
│  └─ models/
│
├─ database/
│
├─ public/
│
├─ resources/
│  ├─ css/
│  ├─ js/
│  └─ views/
│
├─ routes/
│  └─ web.go
│
└─ storage/
```

## app

This directory contains all the back-end code. If you need to add shared business logic, you can create a services folder within the app directory.

```
├─ app/
│  ├─ app.go
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  └─ services/ // [!code ++]
│     └─ invoice.go // [!code ++]
```

For shared logic or utility functions, you can also add a `app/helpers` or `app/utils` folder within app.

## database

Everything related to the database is located here.
If you’d like to create your own database package, you can add files like `database/database.go` or `database/db.go`.
For migration files, you can create a `database/migrations` folder.

```
├─ database/
│  ├─ db.go // [!code ++]
│  └─ migrations/ // [!code ++]
│     ├─ 20240908085315_add_users_table.down.sql // [!code ++]
│     └─ 20240908085315_add_users_table.up.sql // [!code ++]
```

You can read more about database in [The Basics/Database](/v0.2/basics/database).

## public

Publicly accessible files are stored in this directory.

```
├─ public/
│  └─ avatar.png // [!code ++]
```

For example, if you add a file `public/avatar.png`, it will be available at http://localhost:8008/avatar.png.

## resources

This is where all front-end assets like CSS, JavaScript, and view templates are stored.

You can read more about resources in [The Basics/View](/v0.2/basics/view).

## routes

All route definitions are stored in this directory. If you need to define separate routes for an API or admin panel, you can create additional route files.

```
├─ routes/
│  ├─ web.go
│  ├─ api.go // [!code ++]
│  └─ admin.go // [!code ++]
```

You can read more about routing in [The Basics/Routing](/v0.2/basics/routing).

## storage

Files generated by the app or uploaded by users are stored here. If you need to make some files publicly accessible, you can create a symbolic link between the storage/public folder and the public directory.

```sh
mkdir ./storage/public
```

This creates a public folder inside storage.

```sh
ln -s <PATH_TO_YOUR_APP>/storage/public ./public/storage
```

The above command creates a symbolic link at `/public/storage` pointing to `/storage/public/`. Any files placed in `/storage/public` can be accessed at `http://localhost:8008/storage/my-stuff.txt`.

::: info
I plan to add a Refiber command to simplify this process, like `refiber-cli storage:link`
:::
