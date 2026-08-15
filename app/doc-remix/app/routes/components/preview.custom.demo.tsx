import { Preview } from "uplofile";

// render replaces the default grid entirely; build your own list.
<Preview
  render={({ items, actions }) => (
    <ul>
      {items.map((item) => (
        <li key={item.uid}>
          {item.name} - {item.status}
          <button onClick={() => actions.remove(item.uid)}>Remove</button>
        </li>
      ))}
    </ul>
  )}
/>;
