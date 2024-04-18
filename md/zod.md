# zod

## @hookform/resolvers/zod

`react-hook-form`を使う上で`@hookform/resolvers`が必要になります

```
npm i @hookform/resolvers

```

### 使い方

```ruby

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  age: z.number().min(10),
});

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    <!-- zodResolverをここで使います -->
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(d => console.log(d))}>
      <input {...register("name")} />
      {errors.name?.message && <p>{errors.name?.message}</p>}
      <input type="number" {...register("age", { valueAsNumber: true })} />
      {errors.age?.message && <p>{errors.age?.message}</p>}
      <input type="submit" />
    </form>
  );
};

```
