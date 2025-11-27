<template>
  <div class="grid lg:grid-cols-[1fr_1fr] gap-4">
    <div class="bg-muted p-4 rounded-lg flex flex-col gap-6">
      <div>
        <h1 class="text-3xl font-bold text-primary">CORS Checker</h1>
        <h2 class="text-xl font-semibold">Inspect Allowed Methods & Headers</h2>
        <span class="font-mono text-sm">Origin: {{ origin }}</span>
      </div>
      <div class="flex flex-col gap-4">
        <UFormField label="URL to test">
          <UInput v-model="searchUrl" placeholder="Paste your URL" size="xl" />
        </UFormField>
        <UFormField label="Request method">
          <USelect
            v-model="requestMethod"
            :items="requestMethods"
            placeholder="Paste your URL"
            size="xl"
            open-on-focus
            @update:model-value="changeMethod"
          />
        </UFormField>
        <UButton class="w-fit" size="lg" @click="checkFetch">
          {{ requestMethod }}
        </UButton>
      </div>
    </div>
    <div class="bg-muted p-4 rounded-lg flex flex-col gap-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Validator</h2>
        <UBadge size="xl" class="rounded-full" :color="badgeColor">
          <span v-if="statusResponse < 0"> CORS Error</span>
          <span v-else> Status code {{ statusResponse }}</span>
        </UBadge>
      </div>
      <div class="flex flex-col gap-4">
        <ul class="space-y-1" aria-label="Password requirements">
          <li
            v-for="(review, index) in headerReview"
            :key="index"
            class="flex items-center gap-2"
            :class="review.color"
          >
            <UIcon :name="review.icon" class="size-4 shrink-0" />

            <span class="font-light">
              {{ review.text }}
            </span>
          </li>
        </ul>
        <!-- <USeparator color="primary" type="solid" />
        <div>
          <h3 class="text-xl font-semibold">Headers</h3>

          <div v-for="header in headersResponse" class="grid grid-cols-2 gap-2">
            <span>
              {{ header.key.replace(/(^\w|-\w)/g, (s) => s.toUpperCase()) }}
            </span>
            <span>{{ header.value }}</span>
          </div>
        </div>
        <h3 class="text-xl font-semibold">Body</h3> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const origin = ref("");

const { searchUrls, requestMethod, changeMethod, readStorage, addSearchUrl } =
  useLocalStorage();
const searchUrl = ref("https://api.meizuno.com");
const requestMethods = ref([
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
]);

const statusResponse = ref<number>(0);
const headersResponse = ref<{ key: string; value: string | null }[] | null>(
  null
);
const bodyResponse = ref<string>("");
const bodyType = ref<string>("");
const badgeColor = computed(() => {
  if (statusResponse.value < 0) return "error";
  if (statusResponse.value < 200) return "neutral";
  if (statusResponse.value < 300) return "success";
  if (statusResponse.value < 400) return "warning";
  return "error";
});

const headerReview = ref<{ text: string; color: string; icon: string }[]>([
  {
    text: "Access Control Allow Credentials",
    color: "text-muted",
    icon: "i-lucide-circle-x",
  },
  {
    text: "Access Control Allow Headers",
    color: "text-muted",
    icon: "i-lucide-circle-x",
  },
  {
    text: "Access Control Allow Methods",
    color: "text-muted",
    icon: "i-lucide-circle-x",
  },
  {
    text: "Access Control Allow Origin",
    color: "text-muted",
    icon: "i-lucide-circle-x",
  },
]);

const updateHeaderReview = () => {
  headersResponse.value?.forEach((response) => {
    const text = response.key.replace(/(^\w|-\w)/g, (s) =>
      s.replace("-", " ").toUpperCase()
    );

    headerReview.value.forEach((review) => {
      if (review.text === text) {
        if (response.value !== "--") {
          review.color = "text-success";
          review.icon = "i-lucide-circle-check";
        } else {
          review.color = "text-error";
          review.icon = "i-lucide-circle-alert";
        }
      }
    });
  });
};

const serverFetch = async () => {
  const response = await $fetch("/api", {
    method: "POST",
    body: {
      url: searchUrl.value,
      method: requestMethod.value,
    },
  });

  headersResponse.value = response.headers;
  bodyResponse.value = response.body.data;

  const headerType = headersResponse.value?.find(
    (h) => h.key.toLowerCase() === "content-type"
  );

  switch (headerType?.value) {
    case "application/json":
      bodyType.value = "json";
      break;
    default:
      bodyType.value = "text";
  }
};

const clientFetch = async () => {
  try {
    const response = await fetch(searchUrl.value, {
      method: requestMethod.value,
    });

    if (response.ok) {
      statusResponse.value = response.status;
      headersResponse.value?.push({
        key: "access-control-allow-origin",
        value: origin.value,
      });
    }
  } catch (error) {
    headersResponse.value?.push({
      key: "access-control-allow-origin",
      value: "--",
    });
    statusResponse.value = -1;
  }
};

const checkFetch = async () => {
  await serverFetch();
  await clientFetch();
  updateHeaderReview();
};

onMounted(() => {
  origin.value = location.origin;
  readStorage();
});
</script>
