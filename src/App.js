import React, { Suspense } from "react"
const Test = React.lazy(() => import("./test"))

const App = () => (
  <div>
    <Suspense fallback={<div>Loading...</div>}>
      <Test />
    </Suspense>
  </div>
)

export default App
