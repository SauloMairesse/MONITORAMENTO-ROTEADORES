#!/bin/bash 

# Configurações iniciais 
SITE="8.8.8.8" 
CSV_FILE="ping_results_BLOCO_10.csv" 
TXT_FILE="ping_results_BLOCO_10.txt" 
RAW_PING_FILE="ping_raw_output_BLOCO_10.txt" 

DURATION=$((60*60*24*7)) # 7 dias em segundos 
INTERVAL=$((60*2))       # intervalo entre pings = 2 minutos 

# Cabeçalhos dos arquivos 
echo "timestamp,host,ip_local,interface,site,icmp_seq,ttl,rtt_ms,status,erro" > "$CSV_FILE" 
echo "==== Relatório de Conectividade ($(date)) ====" > "$TXT_FILE" 
echo "==== Saída bruta dos pings ($(date)) ====" > "$RAW_PING_FILE" 

# Informações da máquina 
HOSTNAME=$(hostname) 
IP_LOCAL=$(hostname -I | awk '{print $1}') 
INTERFACE=$(ip route get 1 | awk '{print $5; exit}') 

# Controle de tempo 
START_TIME=$(date +%s) 
END_TIME=$((START_TIME + DURATION)) 
SEQ=0 

# Loop principal de ping 
while [ $(date +%s) -lt $END_TIME ]; do 
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S") 
    PING_OUTPUT=$(ping -c 1 -W 2 $SITE 2>&1) 
    STATUS=$? 

    # Salvar o resultado bruto do ping 
    echo "=== [$TIMESTAMP] Ping para $SITE ===" >> "$RAW_PING_FILE" 
    echo "$PING_OUTPUT" >> "$RAW_PING_FILE" 
    echo "" >> "$RAW_PING_FILE" 

    # Processar o resultado do ping 
    if [ $STATUS -eq 0 ]; then 
        LINE=$(echo "$PING_OUTPUT" | grep 'bytes from') 
        IP_DEST=$(echo "$LINE" | awk '{print $4}' | sed 's/://') 
        TTL=$(echo "$LINE" | grep -o 'ttl=[0-9]*' | cut -d= -f2) 
        RTT=$(echo "$LINE" | grep -o 'time=[0-9.]*' | cut -d= -f2) 

        echo "$TIMESTAMP,$HOSTNAME,$IP_LOCAL,$INTERFACE,$IP_DEST,$SEQ,$TTL,$RTT,Sucesso," >> "$CSV_FILE" 
        echo "[$TIMESTAMP] host: $HOSTNAME | ip: $IP_LOCAL | interface: $INTERFACE | site: $IP_DEST | icmp_seq: $SEQ | ttl: $TTL | rtt_ms: $RTT | status: Sucesso" >> "$TXT_FILE" 
    else 
        ERRO=$(echo "$PING_OUTPUT" | head -n 1 | tr ',' ';') 
        echo "$TIMESTAMP,$HOSTNAME,$IP_LOCAL,$INTERFACE,$SITE,$SEQ,,,Falha,\"$ERRO\"" >> "$CSV_FILE" 
        echo "[$TIMESTAMP] host: $HOSTNAME | ip: $IP_LOCAL | interface: $INTERFACE | site: $SITE | icmp_seq: $SEQ | status: Falha | erro: $ERRO" >> "$TXT_FILE" 
    fi 

    ((SEQ++)) 
    sleep "$INTERVAL" 
done
