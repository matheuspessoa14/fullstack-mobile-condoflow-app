import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BRAND_COLORS } from "../assets/branding";
import {
  CondoBottomNav,
  CondoBottomTab,
} from "../components/common/CondoBottomNav";
import { CondoTopHeader } from "../components/common/CondoTopHeader";
import { DirectoryListRow } from "../components/common/DirectoryListRow";
import { api } from "../services/api";

interface CallsSyndicScreenProps {
  onGoBack: () => void;
  onOpenCallDetails?: () => void;
  onPressTab?: (tab: CondoBottomTab) => void;
}

interface Occurrence {
  id: number;
  residentName: string;
  apartmentNumber: string;
  block: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

type FilterOption = "Todas" | "Pendentes" | "Concluídas";

export function CallsSyndicScreen({
  onGoBack,
  onOpenCallDetails,
  onPressTab,
}: CallsSyndicScreenProps) {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [filter, setFilter] = useState<FilterOption>("Todas");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadOccurrences(showLoading = true) {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const response = await api.get<Occurrence[]>("/occurrences");

      const occurrenceList = Array.isArray(response.data)
        ? response.data
        : [];

      const sortedOccurrences = [...occurrenceList].sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      });

      console.log(
        "OCORRÊNCIAS CARREGADAS PARA O SÍNDICO:",
        sortedOccurrences
      );

      setOccurrences(sortedOccurrences);
    } catch (error: any) {
      const status = error?.response?.status;
      const responseData = error?.response?.data;
      const message = error?.message;

      console.log("ERRO AO BUSCAR OCORRÊNCIAS:", {
        status,
        responseData,
        message,
      });

      let errorMessage =
        "Não foi possível carregar as chamadas.";

      if (message === "Network Error") {
        errorMessage =
          "Não foi possível acessar o servidor. Confirme se o backend está ligado na porta 8090.";
      } else if (status === 404) {
        errorMessage =
          "O endpoint de ocorrências não foi encontrado.";
      } else if (status === 403) {
        errorMessage =
          "O servidor bloqueou o acesso às ocorrências.";
      } else if (status === 500) {
        errorMessage =
          "O servidor encontrou um erro ao carregar as ocorrências.";
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (message) {
        errorMessage = message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadOccurrences();
  }, []);

  function handleRefresh() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    loadOccurrences(false);
  }

  function normalizeStatus(status?: string) {
    return (status ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function isCompleted(status?: string) {
    const normalizedStatus = normalizeStatus(status);

    return [
      "concluida",
      "concluido",
      "resolvida",
      "resolvido",
      "fechada",
      "fechado",
      "finalizada",
      "finalizado",
    ].includes(normalizedStatus);
  }

  const completedOccurrences = occurrences.filter((occurrence) =>
    isCompleted(occurrence.status)
  );

  const pendingOccurrences = occurrences.filter(
    (occurrence) => !isCompleted(occurrence.status)
  );

  const showCompleted =
    filter === "Todas" || filter === "Concluídas";

  const showPending =
    filter === "Todas" || filter === "Pendentes";

  function selectFilter(selectedFilter: FilterOption) {
    setFilter(selectedFilter);
    setShowFilters(false);
  }

  function getAvatarLetter(name?: string) {
    const normalizedName = name?.trim();

    if (!normalizedName) {
      return "?";
    }

    return normalizedName.charAt(0).toUpperCase();
  }

  function getResidentName(occurrence: Occurrence) {
    return occurrence.residentName?.trim() || "Morador não informado";
  }

  function getUnit(occurrence: Occurrence) {
    const apartment =
      occurrence.apartmentNumber?.trim() || "Não informado";

    const block =
      occurrence.block?.trim() || "Não informado";

    return `Apto ${apartment} - Bloco ${block}`;
  }

  function getStatus(status?: string) {
    const normalizedStatus = status?.trim();

    if (!normalizedStatus) {
      return "Aberta";
    }

    return normalizedStatus;
  }

  function getCallTitle(occurrence: Occurrence) {
    return occurrence.title?.trim() || "Chamada sem título";
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <CondoTopHeader
          title="Chamadas"
          onBack={onGoBack}
        />
      </View>

      <View style={styles.panel}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[BRAND_COLORS.info]}
              tintColor={BRAND_COLORS.info}
            />
          }
        >
          <Text style={styles.filterLabel}>Filtrar:</Text>

          <TouchableOpacity
            style={styles.selectField}
            onPress={() =>
              setShowFilters((currentValue) => !currentValue)
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Selecionar filtro de chamadas"
          >
            <Text style={styles.selectPlaceholder}>
              {filter}
            </Text>

            <Text style={styles.selectArrow}>
              {showFilters ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {showFilters && (
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => selectFilter("Todas")}
                activeOpacity={0.7}
              >
                <Text style={styles.filterOptionText}>
                  Todas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => selectFilter("Pendentes")}
                activeOpacity={0.7}
              >
                <Text style={styles.filterOptionText}>
                  Pendentes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  styles.lastFilterOption,
                ]}
                onPress={() => selectFilter("Concluídas")}
                activeOpacity={0.7}
              >
                <Text style={styles.filterOptionText}>
                  Concluídas
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={BRAND_COLORS.info}
              />

              <Text style={styles.loadingText}>
                Carregando chamadas...
              </Text>
            </View>
          ) : occurrences.length === 0 ? (
            <View style={styles.noOccurrencesContainer}>
              <Text style={styles.noOccurrencesTitle}>
                Nenhuma chamada cadastrada
              </Text>

              <Text style={styles.noOccurrencesText}>
                As chamadas criadas pelos moradores aparecerão aqui.
              </Text>

              <TouchableOpacity
                style={styles.reloadButton}
                onPress={() => loadOccurrences()}
                activeOpacity={0.7}
              >
                <Text style={styles.reloadButtonText}>
                  Atualizar
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {showCompleted && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        styles.sectionTitleDone,
                      ]}
                    >
                      Chamadas concluídas
                    </Text>

                    <View style={styles.counterDone}>
                      <Text style={styles.counterText}>
                        {completedOccurrences.length}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sectionDivider} />

                  {completedOccurrences.length === 0 ? (
                    <Text style={styles.emptyText}>
                      Nenhuma chamada concluída.
                    </Text>
                  ) : (
                    completedOccurrences.map((occurrence) => (
                      <View
                        key={occurrence.id}
                        style={styles.callContainer}
                      >
                        <Text style={styles.callTitle}>
                          {getCallTitle(occurrence)}
                        </Text>

                        <DirectoryListRow
                          avatarLetter={getAvatarLetter(
                            occurrence.residentName
                          )}
                          avatarTone="soft"
                          name={getResidentName(occurrence)}
                          unit={getUnit(occurrence)}
                          middleText={getStatus(
                            occurrence.status
                          )}
                          middleTone="success"
                          detailsLabel="Ver detalhes"
                          onPress={onOpenCallDetails}
                        />
                      </View>
                    ))
                  )}
                </View>
              )}

              {showPending && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        styles.sectionTitlePending,
                      ]}
                    >
                      Chamadas pendentes
                    </Text>

                    <View style={styles.counterPending}>
                      <Text style={styles.counterText}>
                        {pendingOccurrences.length}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sectionDivider} />

                  {pendingOccurrences.length === 0 ? (
                    <Text style={styles.emptyText}>
                      Nenhuma chamada pendente.
                    </Text>
                  ) : (
                    pendingOccurrences.map((occurrence) => (
                      <View
                        key={occurrence.id}
                        style={styles.callContainer}
                      >
                        <Text style={styles.callTitle}>
                          {getCallTitle(occurrence)}
                        </Text>

                        <DirectoryListRow
                          avatarLetter={getAvatarLetter(
                            occurrence.residentName
                          )}
                          avatarTone="accent"
                          name={getResidentName(occurrence)}
                          unit={getUnit(occurrence)}
                          middleText={getStatus(
                            occurrence.status
                          )}
                          middleTone="danger"
                          detailsLabel="Ver detalhes"
                          onPress={onOpenCallDetails}
                        />
                      </View>
                    ))
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>

        <CondoBottomNav
          active="home"
          onPressTab={onPressTab}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BRAND_COLORS.primaryLight,
  },

  headerArea: {
    paddingBottom: 10,
  },

  panel: {
    flex: 1,
    backgroundColor: BRAND_COLORS.backgroundMuted,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 100,
  },

  filterLabel: {
    marginBottom: 8,
    marginLeft: 4,
    color: BRAND_COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },

  selectField: {
    height: 48,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectPlaceholder: {
    color: BRAND_COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },

  selectArrow: {
    color: BRAND_COLORS.primaryLight,
    fontSize: 13,
    fontWeight: "700",
  },

  filterOptions: {
    marginTop: 2,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    overflow: "hidden",
  },

  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },

  lastFilterOption: {
    borderBottomWidth: 0,
  },

  filterOptionText: {
    color: BRAND_COLORS.text,
    fontSize: 15,
  },

  loadingContainer: {
    paddingVertical: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: BRAND_COLORS.mutedText,
    fontSize: 15,
  },

  noOccurrencesContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 24,
    backgroundColor: BRAND_COLORS.surfaceSoft,
    alignItems: "center",
  },

  noOccurrencesTitle: {
    color: BRAND_COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  noOccurrencesText: {
    marginTop: 8,
    color: BRAND_COLORS.mutedText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  reloadButton: {
    marginTop: 18,
    minWidth: 130,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.info,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  reloadButtonText: {
    color: BRAND_COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  section: {
    marginTop: 22,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  sectionTitleDone: {
    color: BRAND_COLORS.success,
  },

  sectionTitlePending: {
    color: BRAND_COLORS.pending,
  },

  counterDone: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND_COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  counterPending: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND_COLORS.pending,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  counterText: {
    color: BRAND_COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  sectionDivider: {
    width: "100%",
    height: 1,
    backgroundColor: BRAND_COLORS.info,
    marginTop: 7,
    marginBottom: 12,
  },

  callContainer: {
    marginBottom: 12,
  },

  callTitle: {
    marginLeft: 8,
    marginBottom: 5,
    color: BRAND_COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },

  emptyText: {
    color: BRAND_COLORS.mutedText,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 16,
  },
});