import {
  index,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  ...prefix("graph", [
    index("routes/graph.tsx"),
    route("/:scope?/:name", "routes/graph.$name.tsx"),
  ]),
  route("/ai", "routes/ai.tsx"),
] satisfies RouteConfig;
