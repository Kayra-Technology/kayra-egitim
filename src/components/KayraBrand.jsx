import { asset } from "./assetUrl";

export function KayraBrand() {
  return (
    <span className="kayra-identity">
      <img src={asset("brand/kayra-emblem.svg")} alt="" aria-hidden="true" width="31" height="37" />
      <span className="kayra-wordmark">KAYRA<span>TECHNOLOGY</span></span>
    </span>
  );
}
