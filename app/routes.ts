import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("layout/layout.tsx", [
    route("overview", "routes/overview.tsx"),
    route("manual-check", "routes/manual-check.tsx"),
  ]),
] satisfies RouteConfig;
