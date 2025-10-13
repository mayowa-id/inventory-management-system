export function useDarkMode() {
  const [darkMode, setDarkMode] = React.useState(true);

  const toggle = () => setDarkMode(!darkMode);

  return { darkMode, toggle };
}