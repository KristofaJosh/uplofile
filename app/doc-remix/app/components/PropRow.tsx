import { Fragment, type ReactNode } from "react";

type NamedSignature = { name: string; signature?: string };

export type Prop = {
  name: string | NamedSignature[];
  signature?: string;
  required?: boolean;
  description?: ReactNode;
  default?: string | string[];
};

export const PropRows = ({ items }: { items: Prop[] }) => (
  <div className="prop-rows">
    {items.map((item) => {
      const names: NamedSignature[] = Array.isArray(item.name)
        ? item.name
        : [{ name: item.name, signature: item.signature }];
      const defaults = Array.isArray(item.default)
        ? item.default
        : item.default
          ? [item.default]
          : ["—"];
      return (
        <div className="prop-row" key={names.map((n) => n.name).join("-")}>
          <div>
            <div className="prop-row__head">
              {names.map((entry, i) => (
                <Fragment key={entry.name}>
                  {i > 0 && <span className="prop-sep">·</span>}
                  <code>{entry.name}</code>
                  {item.required && i === 0 && (
                    <span className="prop-tag">required</span>
                  )}
                  {entry.signature && (
                    <code className="prop-sig">{entry.signature}</code>
                  )}
                </Fragment>
              ))}
            </div>
            {item.description && (
              <div className="prop-row__desc">{item.description}</div>
            )}
          </div>
          <div className="prop-row__default">
            {defaults.map((value, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {value}
              </Fragment>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);
