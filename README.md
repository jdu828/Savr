# SAVR

A React Native mobile application built with **Expo**, **Node.js**, **TypeScript**, **Jest**, and **Supabase**.

The application uses a layered architecture to keep the UI, application logic, database access, and testing concerns separated.

---

## Tech Stack

* **React Native** — Mobile application framework
* **Expo** — Development and build tooling
* **Node.js / npm** — JavaScript runtime and package management
* **TypeScript** — Type-safe JavaScript
* **Supabase** — PostgreSQL database and backend services
* **Jest** — Unit testing
* **React Hooks** — Frontend data/state management

---

# Getting Started

## 1. Prerequisites

Before running the application, make sure you have:

* Node.js installed
* npm installed
* Expo CLI / Expo tooling available through the project
* Git installed
* Access to the project's Supabase environment

You can verify Node and npm are installed with:

```bash
node -v
npm -v
```

---

# 2. Clone the Repository

Clone the repository and navigate into the project:

```bash
git clone <repository-url>
cd <project-folder>
```

---

# 3. Install Dependencies

From the project root:

```bash
npm install
```

This installs all dependencies defined in `package.json`.

If dependencies change or the project is freshly cloned, run `npm install` again.

---

# 4. Environment Variables

The application requires the Supabase connection information.

Create the appropriate environment file used by the project (for example, `.env` or `.env.local`).

Example:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do **not** commit secret keys or environment files containing private credentials to Git.

The Supabase client is initialized in the application's Supabase/lib configuration and is used by the service layer.

---

# 5. Run the Expo App

Start the Expo development server:

```bash
npx expo start --go
```

Expo will display options for opening the application.

Common options include:

* **Android Emulator** — press `a`
* **iOS Simulator** — press `i` (macOS only)
* **Web** — press `w`
* **Physical device** — scan the QR code using Expo Go

If the application is not loading correctly, try clearing the Expo cache:

```bash
npx expo start -c
```

---

# Project Architecture

The application follows this general flow:

```text
UI / Screen
    ↓
Hook
    ↓
Service Layer
    ↓
Supabase
    ↓
PostgreSQL Database
```

### UI

Responsible for displaying information and handling user interaction.

The UI should generally **not contain direct Supabase queries**.

Example:

```text
RecipeScreen
    ↓
useRecipe()
    ↓
getRecipeById()
    ↓
Supabase
```

---

## Hooks

Hooks provide the UI with the data it needs while keeping data-fetching logic separate from the components.

For example:

```text
useRecipe
useIngredients
useRecipeIngredients
useRecipeEquipment
useRecipeSteps
useRecipeTags
```

A hook typically:

1. Calls the appropriate service
2. Manages loading/error state
3. Stores the returned data
4. Exposes the data to the UI

Conceptually:

```text
Component
    ↓
Hook
    ↓
Service
```

Hooks should be kept separate from UI components whenever practical.

---

## Service Layer

The service layer is responsible for communicating with Supabase.

Examples of services currently used by the application include:

```text
getIngredient
getRecipe
getRecipeEquipment
getRecipeIngredients
getRecipeSteps
getRecipeTags
```

The service layer should contain the database-query logic rather than the UI.

For example:

```text
UI
 ↓
useRecipe()
 ↓
getRecipeById()
 ↓
supabase.from(...)
```

This makes the application easier to test and maintain.

---

## Supabase

Supabase provides the application's PostgreSQL database and backend services.

The database contains the application's recipe-related data, including concepts such as:

* Recipes
* Ingredients
* Recipe Ingredients
* Recipe Equipment
* Recipe Steps
* Recipe Tags
* Equipment
* Tags

Database access is primarily handled through the service layer.

### Row Level Security

Supabase Row Level Security (**RLS**) policies control which records can be accessed.

If a query unexpectedly returns an empty array despite records existing in the database, check the relevant RLS policy before assuming the service or hook is broken.

---

# Testing

The project uses **Jest** for unit testing.

Run the complete test suite with:

```bash
npm test
```

If the project has Jest configured to run in watch mode, you can use:

```bash
npm test -- --watch
```

To run a specific test file:

```bash
npx jest path/to/file.test.ts
```

For example:

```bash
npx jest services/recipes/getRecipe.test.ts
```

---

# What Should Be Tested?

The primary goal of unit tests is to verify that individual pieces of application logic behave correctly.

## Service Tests

Service tests should verify:

### Successful requests

```text
Supabase returns data
        ↓
Service returns expected data
```

### Failed requests

```text
Supabase returns an error
        ↓
Service handles/returns the error correctly
```

### Empty results

```text
Supabase returns []
        ↓
Service correctly handles no records
```

### Query behavior

Tests should also verify that the service makes the expected Supabase query.

For example:

```text
.from(...)
.select(...)
.eq(...)
.single()
```

The exact chain depends on the service being tested.

---

# Mocking Supabase

Service tests should generally **mock Supabase** rather than hitting the real database.

This keeps tests:

* Fast
* Deterministic
* Independent of the database
* Safe to run repeatedly

Conceptually:

```text
Jest Test
   ↓
Mock Supabase
   ↓
Service
   ↓
Expected Result
```

Tests should not require the actual Supabase database to be running.

---

# Recommended Development Workflow

When adding a new piece of functionality, follow this general order:

### 1. Database

Make sure the required table/relationship exists in Supabase.

```text
Database
```

### 2. Service

Create the function responsible for retrieving or modifying the data.

```text
Service
```

### 3. Service Test

Write Jest tests for the service.

```text
Service
 ↓
Jest
```

### 4. Hook

Create a hook that exposes the service's data to the frontend.

```text
Hook
```

### 5. UI

Use the hook in the screen/component.

```text
UI
 ↓
Hook
 ↓
Service
 ↓
Supabase
```

This keeps each layer responsible for one part of the application.

---

# Example Feature Flow

For displaying a recipe:

```text
Recipe Screen
      ↓
useRecipe(recipeId)
      ↓
getRecipeById(recipeId)
      ↓
Supabase
      ↓
recipes table
```

For displaying recipe ingredients:

```text
Recipe Screen
      ↓
useRecipeIngredients(recipeId)
      ↓
getRecipeIngredients(recipeId)
      ↓
Supabase
      ↓
recipe_ingredients
      ↓
ingredients
```

The same general pattern applies to equipment, steps, and tags.

---

# Common Commands

| Command               | Purpose                       |
| --------------------- | ----------------------------- |
| `npm install`         | Install project dependencies  |
| `npx expo start`      | Start Expo development server |
| `npx expo start -c`   | Start Expo and clear cache    |
| `npm test`            | Run Jest tests                |
| `npm test -- --watch` | Run Jest in watch mode        |
| `npx jest <file>`     | Run a specific Jest test file |

---

# Troubleshooting

## Expo says the route cannot be found

First make sure the development server is running:

```bash
npx expo start
```

Then verify that the file is located in the correct Expo Router directory and follows the expected route/file naming convention.

If the issue persists, restart Expo with:

```bash
npx expo start -c
```

---

## Supabase returns `[]` even though data exists

Check:

1. The table name
2. The column names
3. The Supabase query
4. Foreign-key relationships
5. Row Level Security policies
6. Whether the correct Supabase project/environment is being used

An RLS policy can cause a valid query to return no visible rows.

---

## Supabase reports that a column does not exist

For example:

```text
column recipe_tags.id does not exist
```

Check the actual database schema.

Do not assume every table has an `id` column. Some relationship/junction tables may use a composite key or different column structure.

The service query must match the actual Supabase schema.

---

## Jest TypeScript errors

If Jest reports unexpected TypeScript errors involving Supabase mocks:

1. Check the mocked return type.
2. Make sure the mock matches the shape expected by the Supabase call.
3. Avoid using `any` as a first solution.
4. Verify the mocked `data` and `error` properties match the expected response.

The goal is for the mock to represent the actual Supabase response shape.

---

# Development Principles

When contributing to the application, follow these principles:

### Keep database queries out of UI components

Avoid:

```text
Component
    ↓
supabase.from(...)
```

Prefer:

```text
Component
    ↓
Hook
    ↓
Service
    ↓
Supabase
```

### Keep hooks separate from UI

Hooks handle data-fetching/state logic.

Components handle presentation and user interaction.

### Keep services focused

A service should generally have a clear responsibility, such as retrieving a recipe or retrieving recipe ingredients.

### Test the service layer

Services contain important database interaction logic and should have Jest coverage.

### Keep database schema and TypeScript types synchronized

If a database column changes, check:

* Service queries
* TypeScript types
* Hooks
* Components
* Jest mocks/tests

---

# Typical Development Cycle

```text
        ┌──────────────┐
        │   Supabase   │
        │   Database   │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │   Service    │
        │    Layer     │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │     Hook     │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │      UI      │
        └──────────────┘


       Jest tests
            │
            ▼
     Service Layer
            │
            ▼
      Mock Supabase
```

The intended architecture is therefore:

**Database → Service → Hook → UI**

with **Jest testing the service layer independently from the real database**.
