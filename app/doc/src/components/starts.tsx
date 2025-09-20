export async function Stars() {
  const response = await fetch('https://api.github.com/repos/KristofaJosh/uplofile')
  const repo = await response.json()
  const stars = repo.stargazers_count
  return <span>{stars}</span>
}