# Aptos FA Token Script

## Installation

```
$ pnpm install
```

## Usage

Build at local

```
$ pnpm dev:tsc
```

### Run script

#### Resume

```
$ pnpm run resume

start_version: 0 (default: latest version of token in our db)
end_version: x (default: latest transaction version on chain)
```

#### Specified Token

update token list file in `./token-type.json`

```
[
  "0xe444fce955e9d9fe9be765b11e9f541fe97b2b1e910d9149ef81cbbd8a5e8cc7::type::T",
  "0x53748f720669222a7145e1cfa62cd5e0e22431df17ed15af9213c2803fc59fef::type::T",
  "0xa"
]
```

```
$ pnpm run spec
```

## Env config

> Replace `END_POINTER_URL`  
> Replace `OFFICIAL_END_POINTER_URL`
