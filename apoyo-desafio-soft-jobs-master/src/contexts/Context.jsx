import { createContext, useState } from 'react'

const Context = createContext(null)

export const ContextProvider = ({ children }) => {
  const [developer, setDeveloper] = useState(null)

  const getDeveloper = () => developer

  return (
    <Context.Provider value={{ getDeveloper, setDeveloper }}>
      {children}
    </Context.Provider>
  )
}

export default Context
