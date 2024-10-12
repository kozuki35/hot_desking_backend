# app.hot-desking

The hot desking web backend system, mainly handle resource & booking flow.

## Installation

Install `node_modules`:

```bash
npm install
```

## Provided Scripts

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm run start
```

### Build project

```bash
npm run build
```

## Environment Variables

| name             | type   | default     | description                          |
| ---------------- | ------ | ----------- | ------------------------------------ |
| `MONGODB_URI`    | String |             | Your mongodb url                     |
| `PORT`           | Number | `3000`      | Backend service port                 |
| `JWT_SECRET_KEY` | String |             | Your JWT sign private key or secret. |
| `ROOT_RUL`       | String | `"/api/v1"` | Backend url prefix                   |
