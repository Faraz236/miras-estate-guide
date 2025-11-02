import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ✅ Register Times New Roman
Font.register({
  family: "Times-Roman",
  src: "https://fonts.cdnfonts.com/s/16055/Times%20New%20Roman.woff",
});

// ✅ Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    padding: 40,
    position: "relative",
  },
  tealBorder: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    borderColor: "#008080",
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    textDecoration: "underline",
  },
  section: {
    marginBottom: 15,
  },
  table: {
    display: "table",
    width: "auto",
    margin: "0 auto",
    borderWidth: 0.5,
    borderColor: "#000",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "33%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 0.5,
    backgroundColor: "#E8E8E8",
    padding: 5,
  },
  tableCol: {
    width: "33%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 0.5,
    padding: 5,
  },
  tableCellHeader: {
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCell: {
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
  },
  disclaimerBox: {
    borderColor: "red",
    borderWidth: 1,
    padding: 10,
    marginTop: 30,
    marginBottom: 10,
  },
  checklistItem: {
    marginBottom: 8,
    textAlign: "justify",
  },
});

// ✅ PDF Document
const MirasPDF = () => (
  <Document>
    {/* --- PAGE 1: COVER --- */}
    <Page style={styles.page}>
      <View style={styles.tealBorder} />
      <Text style={{ fontSize: 26, textAlign: "center", marginTop: 200 }}>
        Miras – Illinois Islamic Estate Summary
      </Text>

      <Text style={{ fontSize: 14, textAlign: "center", marginTop: 20 }}>
        Date: 2nd November 2025{"\n"}
        State: Illinois{"\n"}
        For: Ahmad Khan
      </Text>

      <View style={styles.disclaimerBox}>
        <Text style={{ textAlign: "center", fontSize: 10 }}>
          ⚠️ Important Disclaimer: This document is for educational purposes
          only and does not constitute legal advice. Always consult a qualified
          attorney or scholar for binding guidance.
        </Text>
      </View>

      <Text style={styles.footer}>
        © 2025 Miras Estate | Educational Draft Summary
      </Text>
    </Page>

    {/* --- PAGE 2: ASSETS, WASSIYAH, SHARIA --- */}
    <Page style={styles.page}>
      <View style={styles.tealBorder} />

      {/* Asset Summary */}
      <Text style={styles.title}>Asset Summary</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Name</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Type</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Value</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Primary Home</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Real Estate</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>$450,000</Text>
          </View>
        </View>
      </View>

      {/* Wassiyah & Charity Allocation */}
      <Text style={styles.title}>Wassiyah & Charity Allocation</Text>
      <Text style={{ textAlign: "center" }}>
        10% of total estate allocated to charity and non-heirs.
      </Text>

      {/* Sharia Distribution */}
      <Text style={styles.title}>Sharia Distribution</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Relation</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Share (%)</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Amount ($)</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Spouse</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>12.5%</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>$56,250</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Son</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>58.3%</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>$262,350</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Daughter</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>29.2%</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>$131,400</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        © 2025 Miras Estate | Page 2 – Illinois Islamic Allocation Summary
      </Text>
    </Page>

    {/* --- PAGE 3: LEGAL CHECKLIST + ACTIONS --- */}
    <Page style={styles.page}>
      <View style={styles.tealBorder} />

      {/* Illinois Legal Checklist */}
      <Text style={styles.title}>Illinois Legal Checklist</Text>
      <View style={{ marginHorizontal: 20 }}>
        <Text style={styles.checklistItem}>
          • Two-witness rule: A valid Illinois will requires your signature plus
          two witnesses who are not beneficiaries.
        </Text>
        <Text style={styles.checklistItem}>
          • Holographic wills: Handwritten wills without proper witnesses are
          NOT valid in Illinois.
        </Text>
        <Text style={styles.checklistItem}>
          • Surviving spouse statutory share: Illinois law allows a surviving
          spouse to claim an elective share.
        </Text>
        <Text style={styles.checklistItem}>
          • Signature formalities: The will must be signed by you and two
          witnesses in your presence.
        </Text>
        <Text style={styles.checklistItem}>
          • Non-probate assets: Assets with beneficiary designations or held in
          joint tenancy pass outside your will.
        </Text>
      </View>

      {/* Prioritized Action Steps */}
      <Text style={styles.title}>Prioritized Action Steps</Text>

      <View style={{ marginLeft: 40, marginRight: 30 }}>
        <Text style={{ marginBottom: 10 }}>
          1. <Text style={{ fontWeight: "bold" }}>Update non-probate asset beneficiaries</Text>
          {"\n"}Review and update beneficiary designations on retirement accounts, life
          insurance, and jointly-owned property.
          {"\n"}Sample message to HR: "I would like to update the beneficiary designation on
          my 401(k) account. Please send me the necessary forms."
        </Text>

        <Text>
          2. <Text style={{ fontWeight: "bold" }}>Schedule attorney consultation</Text>
          {"\n"}Discuss the Illinois spousal elective share and how it affects your estate
          plan.
          {"\n"}Email template: "I am planning my estate and would like to discuss the
          Illinois spousal elective share provisions. I have prepared an Action
          Packet. Can we schedule a one-hour consultation?"
        </Text>
      </View>

      <Text style={styles.footer}>
        © 2025 Miras Estate | Page 3 – Legal Guidance & Action
      </Text>
    </Page>
  </Document>
);

export default MirasPDF;
