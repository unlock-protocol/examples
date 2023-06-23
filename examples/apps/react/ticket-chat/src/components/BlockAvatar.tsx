import * as blockies from "blockies-ts";

interface Props {
  seed: string;
  className?: string;
}

export function BlockAvatar({ className, seed }: Props) {
  const imgSrc = blockies
    .create({
      seed,
    })
    .toDataURL();
  return <img src={imgSrc} className={className} />;
}
