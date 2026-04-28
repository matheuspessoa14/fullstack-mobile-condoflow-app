# CondoFlow

Plataforma full stack móvel de gestão de manutenção condominial.

## Stack tecnológica
- React Native (mobile)
- Java + Spring Boot (backend)
- Spring Security + JWT
- git statusJPA / Hibernate
- MySQL

## Objetivo
Centralizar, organizar e rastrear processos de manutenção condominial, trazendo transparência e controle operacional.

## Arquitetura inicial

### Backend (planejado)
- Controller
- Service
- Repository
- DTO

### Mobile (implementado em `mobile/`)
- Screens
- Components
- Services (API)
- Context / State

## Estrutura do projeto
```text
CondoFlow/
  README.md
  mobile/
    App.tsx
    src/
      components/
      context/
      screens/
      services/
      types/
```

## Como rodar o mobile
1. Entre na pasta:
   - `cd mobile`

2. Instale as dependências:
   - `npm install`

3. Inicie o Expo:
   - `npm start`

4. Execute em cada ambiente:
   - Android: `npm run android`
   - iOS (macOS): `npm run ios`
   - Web: `npm run web`

## Integração com backend Spring
- O app usa `EXPO_PUBLIC_API_URL` quando definida.
- Fallback atual: `http://10.0.2.2:8080/api` (emulador Android).
- Endpoint esperado para lista inicial: `GET /manutencoes`.

## Status
Em desenvolvimento (fase de modelagem e arquitetura).
