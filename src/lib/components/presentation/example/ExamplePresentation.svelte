<script lang="ts">
	import Presentation from "../Presentation.svelte";

    import Slide1 from "./slides/Slide1.svelte";
    import Slide2 from "./slides/Slide2.svelte";
    import Slide3 from "./slides/Slide3.svelte";
    import Slide4 from "./slides/Slide4.svelte";

    const slides = [
        Slide1,
        Slide2,
        Slide3,
        Slide4
    ]
</script>

<Presentation Slides={slides}/>
