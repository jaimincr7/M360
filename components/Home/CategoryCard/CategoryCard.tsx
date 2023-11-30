import Image from "next/image";
import { useRouter } from "next/router";
import { myLoader } from "../../../commonModules/commonInterfaces";
import { useTranslate } from "../../../commonModules/translate";
// import { Brain } from "../../../public/assets";

export default function CategoryCard(props) {
  const router = useRouter();
  const t = useTranslate();
  return (
    <>
      <div className="concernbox-cover">
        <Image
          src={props.image}
          loader={myLoader}
          alt="Brain"
          height={100}
          width={100}
        />
        <h5>{props.name}</h5>
        <p>{props.description}</p>
        <a
          onClick={() =>
            router.push({
              pathname: "/doctor-list",
              query: { specialityId: props.id },
            })
          }
        >
          {t('explore_now')}
        </a>
      </div>
    </>
  );
}
